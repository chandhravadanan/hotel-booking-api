import { Test, TestingModule } from '@nestjs/testing';
import { GoogleMapsModuleConfig } from './google-maps.module.config';
import { GoogleMapsService } from './google-maps.service';

const placesNearbyMock = jest.fn();

jest.mock('@googlemaps/google-maps-services-js', () => ({
  Client: class {
    placesNearby = placesNearbyMock;
  },
}));

describe('GoogleMapsService', () => {
  let service: GoogleMapsService;
  const apiKey = 'secret-key';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GoogleMapsModuleConfig,
          useValue: {
            apiKey,
          },
        },
        GoogleMapsService,
      ],
    }).compile();

    service = module.get<GoogleMapsService>(GoogleMapsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return hotels', async () => {
    placesNearbyMock.mockResolvedValue({
      data: {
        results: [
          {
            name: 'Hotel1',
            place_id: 'ChIJX_kQtrzZnUcR4vh8QEx4MY8',
            plus_code: {
              compound_code: '4HG3+87 Munich',
              global_code: '8FWH4HG3+87',
            },
            rating: 0,
            reference: 'ChIJX_kQtrzZnUcR4vh8QEx4MY8',
            scope: 'GOOGLE',
            geometry: {
              location: {
                lat: 48.1257818,
                lng: 11.5531732,
              },
            },
          },
          {
            name: 'Hotel2',
            place_id: 'ChIJX_kQtrzZnUcR4vh8QEx4MY9',
            plus_code: {
              compound_code: '4HG3+88 Munich',
              global_code: '8FWH4HG3+88',
            },
            rating: 4,
            reference: 'ChIJX_kQtrzZnUcR4vh8QEx4MY9',
            scope: 'GOOGLE',
            geometry: {
              location: {
                lat: 48.1257819,
                lng: 11.5531731,
              },
            },
          },
        ],
      },
    });
    const hotels = await service.getHotels(
      48.12445507010727,
      11.55179872010728,
    );
    expect(hotels).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Hotel1',
          placeId: 'ChIJX_kQtrzZnUcR4vh8QEx4MY8',
          location: [48.1257818, 11.5531732],
          rating: 0,
        }),
        expect.objectContaining({
          name: 'Hotel2',
          placeId: 'ChIJX_kQtrzZnUcR4vh8QEx4MY9',
          location: [48.1257819, 11.5531731],
          rating: 4,
        }),
      ]),
    );
  });
});
