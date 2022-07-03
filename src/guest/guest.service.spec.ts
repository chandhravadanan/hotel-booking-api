import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { rootMongooseTestModule } from '../root-mongo-test.module';
import { GuestService } from './guest.service';
import { Guest, GuestSchema } from './schemas/guest.schema';

describe('GuestService', () => {
  let service: GuestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Guest.name, schema: GuestSchema }]),
      ],
      providers: [GuestService],
    }).compile();

    service = module.get<GuestService>(GuestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new guest if not exist', async () => {
    const guest = {
      name: 'test',
      email: 'test@example.com',
      phoneNumber: '+499876543210',
    };
    const guestDoc1 = await service.upsert(guest);
    expect(guestDoc1).toEqual(expect.objectContaining(guest));

    const guestDoc2 = await service.upsert(guest);
    expect(guestDoc2).toEqual(guestDoc1);
  });
});
