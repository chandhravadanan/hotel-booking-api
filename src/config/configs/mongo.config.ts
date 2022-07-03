import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export default registerAs('mongoDB', () => ({
  config: {
    uri: process.env.MONGOOSE_URI,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    retryWrites: false,
    maxPoolSize: process.env.MONGOOSE_MAX_POOL_SIZE || 20,
  } as MongooseModuleOptions,
}));
