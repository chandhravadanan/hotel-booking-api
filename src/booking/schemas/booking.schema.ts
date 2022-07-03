import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { BookingDataObject } from '../objects';

export type BookingDocument = Booking &
  Document & {
    plainToInstance: () => BookingDataObject;
    timestamp: Date;
  };

@Schema()
export class Booking {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
  })
  hotel: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
  })
  guest: string;

  @Prop({ type: Date, required: true })
  checkIn: Date;

  @Prop({ type: Date, required: true })
  checkOut: Date;

  @Prop({
    required: true,
  })
  amount: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.index({ hotel: 1 });
BookingSchema.index({ checkIn: 1 });
BookingSchema.index({ checkOut: 1 });

BookingSchema.method('plainToInstance', function () {
  return plainToInstance(BookingDataObject, this.toObject());
});
