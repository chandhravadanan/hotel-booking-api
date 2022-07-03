import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEmail,
  IsPhoneNumber,
  Validate,
} from 'class-validator';
import { IsBeforeConstraint, IsDateConstraint } from '../../utils';

export class CreateBookingInput {
  @IsString()
  @ApiProperty({
    type: String,
    example: 'John',
    description: 'Name of the guest',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    type: String,
    example: 'john@example.com',
    description: 'Email of the guest',
  })
  email: string;

  @IsPhoneNumber()
  @ApiProperty({
    type: String,
    example: '+499876543210',
    description: 'Phone number of the guest',
  })
  phoneNumber: string;

  @ApiProperty({
    type: String,
    example: '2022-08-01',
    description: 'Check in date in yyyy-mm-dd',
  })
  @Validate(IsDateConstraint)
  @Validate(IsBeforeConstraint, ['checkOut'])
  checkIn: Date;

  @ApiProperty({
    type: String,
    example: '2022-08-03',
    description: 'Check out date in yyyy-mm-dd',
  })
  @Validate(IsDateConstraint)
  checkOut: Date;

  @IsNumber()
  @ApiProperty({
    type: Number,
    example: '100',
    description: 'Amount to book hotel',
  })
  amount: number;
}
