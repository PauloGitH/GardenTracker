import { defineConfig } from 'vite';
import type { Config } from 'vite';

export default defineConfig((config: Config) => ({
  ...config,
  optimizeDeps: {
    exclude: ['mysql2'],
  },
  typescript: {
    typeCheck: {
      excludeFiles: '**/*.test.ts',
    },
  },
}));
