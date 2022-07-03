import { ModuleMetadata, Type } from '@nestjs/common';
import { GoogleMapsModuleConfig } from '../google-maps.module.config';

export interface IGoogleDataModuleOptionsFactory {
  creatGoogleDataModuleOptions():
    | Promise<GoogleMapsModuleConfig>
    | GoogleMapsModuleConfig;
}

export interface IGoogleDataModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<GoogleMapsModuleConfig>;
  useClass?: Type<GoogleMapsModuleConfig>;
  useFactory?: (
    ...args: any[]
  ) => Promise<GoogleMapsModuleConfig> | GoogleMapsModuleConfig;
}
