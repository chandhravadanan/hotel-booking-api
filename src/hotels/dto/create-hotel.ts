export class CreateHotelDto {
  name: string;
  placeId: string;
  location: [number, number];
  rating?: number;
}
