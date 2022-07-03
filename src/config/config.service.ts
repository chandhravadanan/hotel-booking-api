import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { GoogleMapsModuleConfig } from '../google-maps';

@Injectable()
export class AppConfigService {
  constructor(private config: ConfigService) {}

  public get mongoDBOptions(): MongooseModuleOptions {
    return this.config.get<MongooseModuleOptions>('mongoDB.config');
  }

  public get googleMapsOptions(): GoogleMapsModuleConfig {
    return this.config.get<GoogleMapsModuleConfig>('google-maps.config');
  }
}
