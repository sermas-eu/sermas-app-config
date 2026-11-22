import { z } from 'zod';

// a local .env, when there is one (Node's own loader; existing variables win)
try {
  process.loadEnvFile();
} catch {
  // no .env: the environment alone
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),

  HOST: z.string().min(1).default('localhost'),

  // 8083: the port the UI's dev proxy expects
  PORT: z.coerce.number().int().positive().default(8083),

  CORS_ORIGIN: z.string().default('http://localhost:8080'),

  COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce
    .number()
    .int()
    .positive()
    .default(1000),

  COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(1000),

  // the SERMAS API; the wizard calls it as the logged-in user, with no account of its own
  SERMAS_URL: z.url(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    z.prettifyError(parsedEnv.error),
  );
  throw new Error('Invalid environment variables');
}

export const env = {
  ...parsedEnv.data,
  isDevelopment: parsedEnv.data.NODE_ENV === 'development',
  isProduction: parsedEnv.data.NODE_ENV === 'production',
  isTest: parsedEnv.data.NODE_ENV === 'test',
};
