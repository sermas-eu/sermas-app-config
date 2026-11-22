import { defineConfig } from 'tsup';

// @sermas/api-client is bundled from its sources, so the built server needs no
// published client; its runtime packages (mqtt, jwt-decode) are dependencies here.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node24',
  platform: 'node',
  sourcemap: true,
  clean: true,
  noExternal: ['@sermas/api-client'],
});
