import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 600000, // 10 minutes

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']
  ],

  use: {
    baseURL: 'https://www.saucedemo.com',
    navigationTimeout: 10000,
    actionTimeout: 10000,

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',

    // 🔥 UPDATED PART (IMPORTANT)
    video: {
      mode: 'on', // ✅ replaces 'retain-on-failure'
      show: {
        actions: { position: 'bottom-right' }, // 🖱️ as you wanted
        test: { position: 'top-right' },       // 🧪 step visibility
      },
    },

    headless: false,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});