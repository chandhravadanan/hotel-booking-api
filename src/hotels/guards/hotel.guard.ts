import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { HotelService } from '../hotel.service';

@Injectable()
export class HotelGuard implements CanActivate {
  constructor(private hotelService: HotelService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const hotelId = request.params.hotelId;

    if (!isValidObjectId(hotelId)) {
      throw new BadRequestException('Invalid hotel id');
    }

    const hotelInfo = await this.hotelService.findById(hotelId);

    if (!hotelInfo) {
      throw new BadRequestException('Invalid hotel id');
    }

    return true;
  }
}
