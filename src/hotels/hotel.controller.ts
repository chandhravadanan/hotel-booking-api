import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from '../booking';
import { GoogleMapsService } from '../google-maps';
import { CreateBookingInput } from './input/create-booking';
import { HotelService } from './hotel.service';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GuestService } from '../guest';
import { HotelGuard } from './guards/hotel.guard';

@Controller()
export class HotelController {
  constructor(
    private readonly hotelsService: HotelService,
    private readonly googleMapsService: GoogleMapsService,
    private readonly bookingService: BookingService,
    private readonly guestService: GuestService,
  ) {}

  @Post('hotels')
  @ApiOperation({
    operationId: 'AddHotels',
    summary: 'Add nearby hotels based on location',
    description: 'Search hotels from google maps api and add to DB.',
  })
  @ApiQuery({
    name: 'latitude',
    type: Number,
    example: 48.130323,
    description: 'latitude',
  })
  @ApiQuery({
    name: 'longitude',
    type: Number,
    example: 11.576362,
    description: 'longitude',
  })
  async addHotels(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
  ) {
    if (!latitude || !longitude) {
      throw new BadRequestException('Invalid inputs');
    }

    const hotelsInfo = await this.googleMapsService.getHotels(
      latitude,
      longitude,
    );

    return Promise.all(
      hotelsInfo.map((hotel) => this.hotelsService.upsertByPlaceId(hotel)),
    );
  }

  @Get('hotels')
  @ApiOperation({
    operationId: 'GetHotels',
    summary: 'Retrieve nearby hotels based on location',
    description: 'Search nearby hotels based on location from the DB.',
  })
  @ApiQuery({
    name: 'latitude',
    type: Number,
    example: 48.130323,
    description: 'latitude',
  })
  @ApiQuery({
    name: 'longitude',
    type: Number,
    example: 11.576362,
    description: 'longitude',
  })
  async getHotels(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
  ) {
    if (!latitude || !longitude) {
      throw new BadRequestException('Invalid inputs');
    }
    return this.hotelsService.findAll({
      longitude,
      latitude,
    });
  }

  @Get('hotel/:hotelId/bookings')
  @UseGuards(HotelGuard)
  @ApiOperation({
    operationId: 'GetHotelBookings',
    summary: 'Retrieve hotel booking',
    description: 'get all bookings of particular hotel by hotelId.',
  })
  async getHotelBookings(@Param('hotelId') hotelId: string) {
    return this.bookingService.get(hotelId);
  }

  @Post('hotel/:hotelId/book')
  @UseGuards(HotelGuard)
  @ApiOperation({
    operationId: 'BookHotel',
    summary: 'Book hotel for guest',
    description: 'Book hotel for specific days for specifc guest.',
  })
  @ApiBody({ type: CreateBookingInput })
  async bookHotel(
    @Param('hotelId') hotelId: string,
    @Body() createBookingInput: CreateBookingInput,
  ) {
    const { name, email, phoneNumber } = createBookingInput;
    const guest = await this.guestService.upsert({
      name,
      email,
      phoneNumber,
    });

    const { checkIn, checkOut, amount } = createBookingInput;
    return this.bookingService.create({
      hotel: hotelId,
      guest: guest.id,
      checkIn,
      checkOut,
      amount,
    });
  }
}
