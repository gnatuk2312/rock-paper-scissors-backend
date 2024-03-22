import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
}));
