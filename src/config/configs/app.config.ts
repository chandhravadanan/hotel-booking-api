import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  mongoConnectionUri: process.env.MONGODB_URI,
}));
