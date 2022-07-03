import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { CreateBookingDto } from './dto';
import { BookingDataObject } from './objects/booking.object';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class BookingService {
  static MAX_BOOKINGS_PER_DAY = 10;

  public logger = new Logger(BookingService.name);

  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  // this will return past bookings as well
  async get(hotel: string): Promise<BookingDataObject[]> {
    const bookings = await this.bookingModel.find({
      hotel,
    });

    return bookings.map((booking) => booking.plainToInstance());
  }

  async isHotelAvailable(
    hotel: string,
    start: Date,
    end: Date,
  ): Promise<boolean> {
    const currrentBookings = await this.bookingModel.find({
      hotel,
      checkIn: { $lte: start },
      checkOut: { $gte: end },
    });

    if (currrentBookings?.length >= BookingService.MAX_BOOKINGS_PER_DAY) {
      return false;
    }

    return true;
  }

  async create(createBookingDto: CreateBookingDto): Promise<BookingDataObject> {
    const { hotel, checkIn, checkOut } = createBookingDto;
    const transactionSession = await this.connection.startSession();
    try {
      transactionSession.startTransaction();

      const isAvailable = await this.isHotelAvailable(hotel, checkIn, checkOut);

      if (!isAvailable) {
        this.logger.log(
          `hotel ${hotel} reached max booking on ${checkIn} ${checkOut}`,
        );
        throw new NotFoundException(
          `hotel reached max booking on ${checkIn} - ${checkOut}`,
        );
      }

      const booking = new this.bookingModel(createBookingDto);
      const bookingDoc: any = await booking.save();
      transactionSession.commitTransaction();

      return bookingDoc.plainToInstance();
    } catch (e) {
      await transactionSession.abortTransaction();
      throw e;
    } finally {
      await transactionSession.endSession();
    }
  }
}
