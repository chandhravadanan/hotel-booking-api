import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGuestDto } from './dto';
import { GuestDataObject } from './objects/guest.object';
import { Guest, GuestDocument } from './schemas/guest.schema';

@Injectable()
export class GuestService {
  constructor(
    @InjectModel(Guest.name) private guestModel: Model<GuestDocument>,
  ) {}

  async upsert(createGuestDto: CreateGuestDto): Promise<GuestDataObject> {
    const guestDoc = await this.guestModel.findOneAndUpdate(
      {
        email: createGuestDto.email,
      },
      {
        $set: {
          name: createGuestDto.name,
          phoneNumber: createGuestDto.phoneNumber,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    return guestDoc.plainToInstance();
  }
}
