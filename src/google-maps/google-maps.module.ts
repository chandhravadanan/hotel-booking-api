import { DynamicModule, Global, Module } from '@nestjs/common';
import { GoogleMapsModuleConfig } from './google-maps.module.config';
import { GoogleMapsService } from './google-maps.service';
import { IGoogleDataModuleAsyncOptions } from './interfaces';

@Global()
@Module({})
export class GoogleMapsDataCoreModule {
  public static forRootAsync(
    options: IGoogleDataModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: GoogleMapsDataCoreModule,
      imports: [...options.imports],
      exports: [GoogleMapsService],
      providers: [
        {
          provide: GoogleMapsModuleConfig,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        GoogleMapsService,
      ],
    };
  }
}

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class GoogleMapsModule {
  public static forRootAsync(
    options: IGoogleDataModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: GoogleMapsModule,
      imports: [GoogleMapsDataCoreModule.forRootAsync(options)],
    };
  }
}
