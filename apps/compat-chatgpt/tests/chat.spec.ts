import { test, expect } from '@playwright/test';
test('static HTML hydrates, handles input, navigation and reload', async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  const html = await (await request.get('/')).text();
  expect(html).toContain('What can I help with?');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByLabel('Message').fill('Hello from test');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByText('Hello from test')).toBeVisible();
  await expect(
    page.getByText('Here is a deterministic demo response.'),
  ).toBeVisible();
  await page.getByRole('link', { name: 'About this demo' }).click();
  await expect(
    page.getByText('Responses are deterministic fixtures, not AI-generated.'),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'About this demo' }),
  ).toBeVisible();
  await page.goto('/');
  await page.reload();
  await page.getByLabel('Message').fill('After reload');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByText('After reload')).toBeVisible();
  await expect(
    page.getByText('Here is a deterministic demo response.'),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
