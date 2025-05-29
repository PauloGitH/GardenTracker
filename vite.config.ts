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
  server: {
    env: {
      DATABASE_URL: 'mysql://root:password@localhost:3306/garden_tracker'
    }
  },
  preview: {
    env: {
      DATABASE_URL: 'mysql://root:password@localhost:3306/garden_tracker'
    }
  }
}));
