import { Exclude, Expose, Transform } from 'class-transformer';
import { transformToAlias } from '../../utils';
import { IGuest } from '../interfaces';

@Exclude()
export class GuestDataObject implements IGuest {
  @Expose()
  @Transform(transformToAlias('_id'))
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  public phoneNumber: string;
}
