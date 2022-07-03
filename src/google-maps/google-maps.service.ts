import { Injectable } from '@nestjs/common';
import { GoogleMapsModuleConfig } from './google-maps.module.config';
import { Client } from '@googlemaps/google-maps-services-js';
import { Place } from './interfaces';

@Injectable()
export class GoogleMapsService extends Client {
  constructor(private config: GoogleMapsModuleConfig) {
    super();
  }

  // google API returns 20 results
  async getHotels(latitude: number, longitude: number): Promise<Place[]> {
    const { data } = await this.placesNearby({
      params: {
        type: 'hotels',
        radius: 1500,
        location: [latitude, longitude],
        key: this.config.apiKey,
      },
    });

    const hotelsInfo = data.results.map(
      (hotel) =>
        ({
          name: hotel.name,
          rating: hotel.rating,
          placeId: hotel.place_id,
          location: [
            hotel.geometry?.location.lat,
            hotel.geometry?.location.lng,
          ],
        } as Place),
    );

    return hotelsInfo;
  }
}
