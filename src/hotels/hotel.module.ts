import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingModule } from '../booking';
import { GoogleMapsModule } from '../google-maps';
import { GuestModule } from '../guest';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { Hotel, HotelSchema } from './schemas/hotel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    GoogleMapsModule,
    BookingModule,
    GuestModule,
  ],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
