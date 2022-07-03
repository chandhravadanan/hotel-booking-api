import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { rootMongooseTestModule } from '../root-mongo-test.module';
import { BookingService } from './booking.service';
import { Booking, BookingSchema } from './schemas/booking.schema';
import * as dayjs from 'dayjs';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Booking.name, schema: BookingSchema },
        ]),
      ],
      providers: [BookingService],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create booking', async () => {
    const bookingInfo = {
      hotel: new Types.ObjectId().toHexString(),
      guest: new Types.ObjectId().toHexString(),
      checkIn: dayjs().add(1, 'day').toDate(),
      checkOut: dayjs().add(2, 'day').toDate(),
      amount: 100,
    };
    const booking = await service.create(bookingInfo);
    expect(booking).toEqual(expect.objectContaining(bookingInfo));
  });

  it('should allow only 10 booking per day', async () => {
    const bookingInfo = {
      hotel: new Types.ObjectId().toHexString(),
      guest: new Types.ObjectId().toHexString(),
      checkIn: dayjs().add(1, 'day').toDate(),
      checkOut: dayjs().add(2, 'day').toDate(),
      amount: 100,
    };
    const bookings = await Promise.all(
      [...Array(10)].map(async () => service.create(bookingInfo)),
    );
    expect(bookings.length).toBe(10);
    expect(service.create(bookingInfo)).rejects.toThrow();
  });
});
