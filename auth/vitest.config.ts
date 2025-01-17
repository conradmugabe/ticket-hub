/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: { provider: 'istanbul' },
    setupFiles: ['tests/setup.ts'],
  },
});
