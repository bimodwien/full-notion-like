import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Same "@/..." alias as tsconfig.json, so tested files import exactly as in the app.
  resolve: { alias: { '@': import.meta.dirname } },
  test: {
    include: ['**/*.test.ts'],
    exclude: ['node_modules/**', '.next/**'],
  },
});
