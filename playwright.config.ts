import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  retries: 1,
  reporter: [['html', { outputFolder: 'reports', open: 'never' }]],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
});
