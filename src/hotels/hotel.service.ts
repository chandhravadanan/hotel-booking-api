import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHotelDto, FindHotelDto } from './dto';
import { HotelDataObject } from './objects';
import { Hotel, HotelDocument } from './schemas/hotel.schema';

@Injectable()
export class HotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
  ) {}

  async create(createHotelDto: CreateHotelDto): Promise<HotelDataObject> {
    const hotel = new this.hotelModel(createHotelDto);
    const hotelDoc = await hotel.save();
    return hotelDoc.plainToInstance();
  }

  async findById(hotelId: string): Promise<Hotel> {
    return this.hotelModel.findById(hotelId);
  }

  async findByPlaceId(placeId: string): Promise<Hotel> {
    return this.hotelModel.findOne({
      placeId,
    });
  }

  async upsertByPlaceId(
    createHotelDto: CreateHotelDto,
  ): Promise<HotelDataObject> {
    const hotel = await this.findByPlaceId(createHotelDto.placeId);
    if (!hotel) {
      return this.create(createHotelDto);
    }

    const newInfo = { ...hotel, createHotelDto };
    const hotelDoc = await this.hotelModel.findByIdAndUpdate(
      hotel,
      { $set: newInfo },
      { new: true },
    );

    return hotelDoc.plainToInstance();
  }

  async findAll(params: FindHotelDto): Promise<HotelDataObject[]> {
    const hotels = await this.hotelModel.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [params.latitude, params.longitude],
          },
          $maxDistance: 5000,
        },
      },
    });

    return hotels.map((hotel) => hotel.plainToInstance());
  }
}
