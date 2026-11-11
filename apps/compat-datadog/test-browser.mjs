import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { join } from 'node:path';

const probe = createServer();
await new Promise((resolve, reject) =>
  probe.once('error', reject).listen(0, '127.0.0.1', resolve),
);
const port = probe.address().port;
await new Promise((resolve) => probe.close(resolve));
const server = spawn(
  join(process.cwd(), 'node_modules/.bin/vite'),
  ['preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { stdio: 'ignore' },
);
let browser;
try {
  const url = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(url)).ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'Preview server started');
  const options = { headless: true };
  if (process.env.CHROME_PATH) options.executablePath = process.env.CHROME_PATH;
  browser = await chromium.launch(options);
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(url);
  await page.getByRole('button', { name: /errors ↕/i }).click();
  assert.match(
    await page.locator('tbody tr').first().innerText(),
    /ingestion.*22/s,
  );
  await page.getByRole('checkbox', { name: 'Select checkout' }).check();
  await page.getByRole('textbox', { name: 'Search' }).fill('pay');
  assert.equal(await page.locator('tbody tr').count(), 1);
  assert.match(await page.locator('tbody tr').first().innerText(), /payments/);
  assert.ok(await page.getByText('1 selected').isVisible());
  await page.getByRole('button', { name: 'Refresh' }).click();
  assert.equal(await page.locator('tbody tr').count(), 4);
  await page.setViewportSize({ width: 600, height: 800 });
  await page.waitForFunction(
    () => document.documentElement.scrollWidth === innerWidth,
  );
  const dimensions = await page.evaluate(() => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
    chart: document.querySelector('.recharts-wrapper').getBoundingClientRect()
      .width,
  }));
  assert.equal(dimensions.document, dimensions.viewport);
  assert.ok(dimensions.chart > 0 && dimensions.chart <= dimensions.viewport);
  const chart = page.locator('.recharts-wrapper');
  await chart.scrollIntoViewIfNeeded();
  await chart.hover({ position: { x: dimensions.chart / 2, y: 100 } });
  await page.waitForFunction(() =>
    document
      .querySelector('.recharts-tooltip-wrapper')
      ?.textContent.includes('requests'),
  );
  assert.match(
    await page.locator('.recharts-tooltip-wrapper').innerText(),
    /requests\s*:\s*94/,
  );
  assert.deepEqual(errors, []);
  console.log('Dashboard production browser checks passed.');
} finally {
  await browser?.close();
  server.kill();
  await new Promise((resolve) => server.once('exit', resolve));
}
