import { test, expect } from '@playwright/test';
test('feed fixtures, identity, scrolling, tabs, resize and theme', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const first = page.locator('article').filter({ hasText: 'Post 1:' });
  await expect(first).toBeVisible();
  await first.getByRole('button', { name: 'Like', exact: true }).click();
  await expect(first.getByRole('button', { name: 'Unlike' })).toBeVisible();
  await page.getByLabel('Your post').fill('A new post');
  await page.getByRole('button', { name: 'Post', exact: true }).click();
  await expect(page.getByText('A new post')).toBeVisible();
  await expect(first.getByRole('button', { name: 'Unlike' })).toBeVisible();
  await expect(
    page
      .locator('article')
      .filter({ hasText: 'A new post' })
      .getByRole('button', { name: 'Like', exact: true }),
  ).toBeVisible();
  await first.getByRole('button', { name: 'More' }).click();
  await expect(
    first.getByText('Expanded detail', { exact: false }),
  ).toBeVisible();
  const feed = page.getByLabel('Feed posts');
  await feed.evaluate((el) => (el.scrollTop = 3000));
  await expect(page.getByText('Post 25:', { exact: false })).toBeVisible();
  await feed.evaluate((el) => (el.scrollTop = 0));
  await expect(first.getByRole('button', { name: 'Unlike' })).toBeVisible();
  await page.getByRole('button', { name: 'Dark theme' }).click();
  await expect(page.locator('.app')).toHaveClass(/dark/);
  const cdp = await page.context().newCDPSession(page);
  const selected = async (name: string) => {
    const ax = await cdp.send('Accessibility.getFullAXTree');
    return ax.nodes
      .find((n) => n.role?.value === 'tab' && n.name?.value === name)
      ?.properties?.find((p) => p.name === 'selected')?.value?.value;
  };
  expect(await selected('For you')).toBe(true);
  await page.getByRole('tab', { name: 'For you' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Following' })).toBeFocused();
  await expect.poll(() => selected('Following')).toBe(true);
  await expect.poll(() => selected('For you')).toBe(false);
  await expect(page.getByText('Post 1:', { exact: false })).toHaveCount(0);
  await page.getByRole('button', { name: 'loading', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Loading');
  await page.getByRole('button', { name: 'error', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Could not load');
  await page.getByRole('button', { name: 'success', exact: true }).click();
  await expect(page.getByText('Post 2:', { exact: false })).toBeVisible();
  expect(errors).toEqual([]);
});
