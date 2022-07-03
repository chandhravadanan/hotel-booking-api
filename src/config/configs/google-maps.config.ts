import { registerAs } from '@nestjs/config';
import { GoogleMapsModuleConfig } from '../../google-maps';

export default registerAs('google-maps', () => ({
  config: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
  } as GoogleMapsModuleConfig,
}));
