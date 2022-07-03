import { Exclude, Expose, Transform } from 'class-transformer';
import { transformToAlias } from '../../utils';
import { IHotel } from '../interfaces';

@Exclude()
export class HotelDataObject implements IHotel {
  @Expose()
  @Transform(transformToAlias('_id'))
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public placeId: string;

  @Expose()
  public location: [number, number];

  @Expose()
  public rating?: number;
}
