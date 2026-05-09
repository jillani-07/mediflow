import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT ?? '3001', 10),
  secret: process.env.APP_SECRET ?? 'fallback_dev_secret',
}));