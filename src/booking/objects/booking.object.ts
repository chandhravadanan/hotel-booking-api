import { Exclude, Expose, Transform } from 'class-transformer';
import {
  transformMongoDbId,
  transformToAlias,
  transformToDate,
} from '../../utils';
import { IBooking } from '../interfaces';

@Exclude()
export class BookingDataObject implements IBooking {
  @Expose()
  @Transform(transformToAlias('_id'))
  public id: string;

  @Expose()
  @Transform(transformMongoDbId('hotel'))
  public hotel: string;

  @Expose()
  @Transform(transformMongoDbId('guest'))
  public guest: string;

  @Expose()
  @Transform(transformToDate())
  public checkIn: Date;

  @Expose()
  @Transform(transformToDate())
  public checkOut: Date;

  @Expose()
  public amount: number;
}
