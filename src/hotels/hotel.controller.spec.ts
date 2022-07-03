import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule, AppConfigService } from '../config';
import { BookingModule } from '../booking';
import { GoogleMapsModule } from '../google-maps';
import { GuestModule } from '../guest';
import { rootMongooseTestModule } from '../root-mongo-test.module';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { Hotel, HotelSchema } from './schemas/hotel.schema';

describe('HotelsController', () => {
  let controller: HotelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
        GoogleMapsModule.forRootAsync({
          imports: [AppConfigModule],
          inject: [AppConfigService],
          useFactory: async () => ({ apiKey: 'abcd' }),
        }),
        BookingModule,
        GuestModule,
      ],
      providers: [HotelService],
      controllers: [HotelController],
    }).compile();

    controller = module.get<HotelController>(HotelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
