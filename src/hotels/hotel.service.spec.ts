import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { rootMongooseTestModule } from '../root-mongo-test.module';
import { HotelService } from './hotel.service';
import { IHotel } from './interfaces';
import { Hotel, HotelSchema } from './schemas/hotel.schema';

describe('HotelsService', () => {
  let service: HotelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
      ],
      providers: [HotelService],
    }).compile();

    service = module.get<HotelService>(HotelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create hotel', async () => {
    const hotel = {
      name: 'Test Hotel',
      placeId: 'ChIJX_kQtrzZnUcR4vh8QEx4MY8',
      location: [48.12445507010727, 11.55179872010728],
    } as IHotel;
    const hotelDoc = await service.create(hotel);
    expect(hotelDoc).toEqual(expect.objectContaining(hotel));
  });

  it('should upsert hotel', async () => {
    const hotel = {
      name: 'Test Hotel',
      placeId: 'ChIJX_kQtrzZnUcR4vh8QEx4MY8',
      location: [48.12445507010727, 11.55179872010728],
      rating: 4,
    } as IHotel;
    const hotelDoc1 = await service.upsertByPlaceId(hotel);
    expect(hotelDoc1).toEqual(expect.objectContaining(hotel));

    const hotelDoc2 = await service.upsertByPlaceId(hotel);
    expect(hotelDoc2).toEqual(expect.objectContaining(hotel));
    expect(hotelDoc2.id).toEqual(hotelDoc1.id);
  });

  it('findAll should return nearby hotel', async () => {
    await Promise.all([
      service.upsertByPlaceId({
        name: 'Test Hotel',
        placeId: 'ChIJX_kQtrzZnUcR4vh8QEx4MY8',
        location: [48.12445507010727, 11.55179872010728],
        rating: 4,
      }),
      service.upsertByPlaceId({
        name: 'Test Hotel',
        placeId: 'ChIJX_kQtrzZnUcR4vh8QEx4MY10',
        location: [58.12445507010727, 21.55179872010728],
        rating: 3,
      }),
    ]);

    const hotels = await service.findAll({
      latitude: 48.12445507010727,
      longitude: 11.55179872010728,
    });
    expect(hotels.length).toBe(1);
    expect(hotels[0]).toEqual(
      expect.objectContaining({
        name: 'Test Hotel',
        placeId: 'ChIJX_kQtrzZnUcR4vh8QEx4MY8',
        location: [48.12445507010727, 11.55179872010728],
        rating: 4,
      }),
    );
  });
});
