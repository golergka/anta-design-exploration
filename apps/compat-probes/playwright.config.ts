import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', workers: 2, timeout: 15000,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  use: { baseURL: 'http://127.0.0.1:4397', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }, { name: 'webkit', use: { browserName: 'webkit' } }, { name: 'firefox', use: { browserName: 'firefox' } }],
  webServer: { command: 'npm run preview -- --port 4397 --strictPort', url: 'http://127.0.0.1:4397', reuseExistingServer: false },
});
