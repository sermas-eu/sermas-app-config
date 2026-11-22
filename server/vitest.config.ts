import path from 'node:path';
import { defineConfig } from 'vitest/config';

// @sermas/api-client from its sources: API_CLIENT_DIR, or the checkout beside this one
const apiClientDir = path.resolve(
  process.env.API_CLIENT_DIR || '../../sermas-api-client',
);

export default defineConfig({
  resolve: {
    alias: {
      '@/': `${path.resolve('src')}/`,
      '@sermas/api-client': path.join(apiClientDir, 'src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    env: { NODE_ENV: 'test', SERMAS_URL: 'http://sermas.test' },
    restoreMocks: true,
  },
});
