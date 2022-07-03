import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { GuestDataObject } from '../objects/guest.object';

export type GuestDocument = Guest &
  Document & {
    plainToInstance: () => GuestDataObject;
    timestamp: Date;
  };

@Schema()
export class Guest {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  phoneNumber: string;
}

export const GuestSchema = SchemaFactory.createForClass(Guest);

GuestSchema.index({ email: 'text' });
GuestSchema.index({ phoneNumebr: 'text' });

GuestSchema.method('plainToInstance', function () {
  return plainToInstance(GuestDataObject, this.toObject());
});
