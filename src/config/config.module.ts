import { Module } from '@nestjs/common';
import { AppConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './configs/app.config';
import mongoConfig from './configs/mongo.config';
import googleMapsConfig from './configs/google-maps.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, mongoConfig, googleMapsConfig],
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
