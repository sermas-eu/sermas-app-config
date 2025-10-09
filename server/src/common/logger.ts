import { env } from '@/common/utils/envConfig';
import pino from 'pino';

export const getLogger = (name?: string) =>
  pino({
    name,
    level: env.isProduction ? 'info' : 'debug',
    transport: env.isProduction ? undefined : { target: 'pino-pretty' },
  });
