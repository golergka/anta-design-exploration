import { test, expect } from '@playwright/test';
for (const control of ['native', 'anta']) {
  test.describe(control, () => {
    test.beforeEach(async ({ page }) => { await page.goto(`/?control=${control}`); });
    test('visible labels name their textboxes', async ({ page }) => {
      await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Notes', exact: true })).toBeVisible();
    });
    test('FormData includes edited email and notes exactly once', async ({ page }) => {
      await page.locator('input[name=email], a-input[name=email] input').fill('edited@example.com');
      await page.locator('textarea[name=notes], a-input[name=notes] textarea').fill('Changed notes');
      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      const data = JSON.parse(await page.getByLabel('Submission', { exact: true }).innerText());
      expect(data.email).toBe('edited@example.com'); expect(data.notes).toBe('Changed notes');
      expect(data.color).toBe(control === 'native' ? 'blue' : undefined);
      await expect(page.getByLabel('Submission count')).toHaveText('1');
    });
    test('native validation prevents invalid submit', async ({ page }) => {
      await page.locator('input[name=email], a-input[name=email] input').fill('invalid');
      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      await expect(page.getByLabel('Submission count')).toHaveText('0');
    });
    test('form reset restores uncontrolled defaults', async ({ page }) => {
      const email = page.locator('input[name=email], a-input[name=email] input');
      await email.fill('edited@example.com');
      await page.getByRole('button', { name: 'Reset', exact: true }).click();
      await expect(email).toHaveValue('initial@example.com');
    });
    test('disabled fieldset omits controls from FormData', async ({ page }) => {
      await page.getByRole('button', { name: 'Toggle fieldset' }).click();
      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      await expect(page.getByLabel('Submission', { exact: true })).toHaveText('{}');
    });
    test('StrictMode remount does not duplicate submission listeners', async ({ page }) => {
      for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Remount controls' }).click();
      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      await expect(page.getByLabel('Submission count')).toHaveText('1');
    });
    test('theme changes page and short viewport has no horizontal overflow', async ({ page }) => {
      const color = await page.locator('body').evaluate(e => getComputedStyle(e).backgroundColor);
      await page.getByRole('button', { name: 'Toggle theme' }).click();
      await expect.poll(() => page.locator('body').evaluate(e => getComputedStyle(e).backgroundColor)).not.toBe(color);
      await page.setViewportSize({ width: 375, height: 500 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  });
}

// Independent control: if this fails, app-level pointer failures cannot be attributed to Anta.
test('environment can click a plain button without Anta', async ({ page }) => {
  await page.setContent('<button onclick="this.textContent=\'Clicked\'">Control</button>');
  await page.getByRole('button', { name: 'Control' }).click({ timeout: 3000 });
  await expect(page.getByRole('button')).toHaveText('Clicked');
});
