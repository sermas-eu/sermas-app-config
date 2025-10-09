import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({
  quiet: true,
});

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),

  HOST: z.string().min(1).default('localhost'),

  PORT: z.coerce.number().int().positive().default(8080),

  CORS_ORIGIN: z.string().default('http://localhost:8080'),

  COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce
    .number()
    .int()
    .positive()
    .default(1000),

  COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(1000),

  SERMAS_URL: z.coerce.string().url(),
  SERMAS_CLIENT_ID: z.coerce.string().optional(),
  SERMAS_CLIENT_SECRET: z.coerce.string().optional(),
  SERMAS_USER: z.coerce.string().optional(),
  SERMAS_PASSWORD: z.coerce.string().optional(),
  SERMAS_APPID: z.coerce.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment variables');
}

export const env = {
  ...parsedEnv.data,
  isDevelopment: parsedEnv.data.NODE_ENV === 'development',
  isProduction: parsedEnv.data.NODE_ENV === 'production',
  isTest: parsedEnv.data.NODE_ENV === 'test',
};
