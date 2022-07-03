import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelModule } from './hotels/hotel.module';
import { AppConfigModule, AppConfigService } from './config';
import { GoogleMapsModule } from './google-maps/google-maps.module';
import { BookingModule } from './booking';
import { GuestModule } from './guest';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => config.mongoDBOptions,
    }),
    GoogleMapsModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (config: AppConfigService) => config.googleMapsOptions,
    }),
    HotelModule,
    BookingModule,
    GuestModule,
  ],
  providers: [],
})
export class AppModule {}
