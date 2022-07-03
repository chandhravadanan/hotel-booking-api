import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { HotelDataObject } from '../objects';

export type HotelDocument = Hotel &
  Document & {
    plainToInstance: () => HotelDataObject;
    timestamp: Date;
  };

@Schema()
export class Hotel {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  placeId: string;

  @Prop({
    required: true,
  })
  location: number[];

  @Prop()
  rating: number;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);

HotelSchema.index({ placeId: 'text' });
HotelSchema.index({ location: '2dsphere' });

HotelSchema.method('plainToInstance', function () {
  return plainToInstance(HotelDataObject, this.toObject());
});
