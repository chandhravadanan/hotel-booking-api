import { HotelGuard } from './hotel.guard';

describe('HotelGuard', () => {
  const findById: any = jest.fn();
  const getRequest = jest.fn();

  const hotelServiceMock = {
    findById,
  } as any;

  const context = {
    switchToHttp: () => ({
      getRequest,
    }),
  } as any;

  it('should be defined', () => {
    expect(new HotelGuard(hotelServiceMock)).toBeDefined();
  });

  it('should throw error if hotel Id param not exist', () => {
    getRequest.mockReturnValue({
      params: {},
    });
    const guard = new HotelGuard(hotelServiceMock);
    expect(guard.canActivate(context)).rejects.toThrow('Invalid hotel id');
  });

  it('should throw error if hotel Id param not an objectId', () => {
    getRequest.mockReturnValue({
      params: { hotelId: 'abcd' },
    });
    const guard = new HotelGuard(hotelServiceMock);
    expect(guard.canActivate(context)).rejects.toThrow('Invalid hotel id');
  });

  it('should throw error if hotel Id not exist in DB', () => {
    getRequest.mockReturnValue({
      params: { hotelId: '62c0abfdf72edf99fe4559f0' },
    });
    findById.mockResolvedValue(null);
    const guard = new HotelGuard(hotelServiceMock);
    expect(guard.canActivate(context)).rejects.toThrow('Invalid hotel id');
  });

  it('should return true if hotel Id exist in DB', () => {
    getRequest.mockReturnValue({
      params: { hotelId: '62c0abfdf72edf99fe4559f0' },
    });
    findById.mockResolvedValue({ id: '62c0abfdf72edf99fe4559f0' });
    const guard = new HotelGuard(hotelServiceMock);
    expect(guard.canActivate(context)).toBeTruthy();
  });
});
