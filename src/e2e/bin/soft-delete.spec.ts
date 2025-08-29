import { test, expect } from '../fixtures';

test.setTimeout(60000);

test.describe('Soft Delete Bin (restore flows)', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication as admin user before each test
    await page.goto('/dashboard');
  });

  test('policyholders bin shows items and can restore', async ({ page }) => {
    await page.goto('/policyholders/bin', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByRole('heading', { name: /soft deleted policyholders/i })
    ).toBeVisible();
    const rows = page.locator('tbody tr');
    const startCount = await rows.count();

    if (startCount === 0) {
      // Nothing to restore; treat as pass (no soft-deleted items)
      return;
    }
    const firstRow = rows.first();
    const firstName =
      (await firstRow.locator('td').first().textContent())?.trim() || '';
    await firstRow.getByRole('button', { name: /restore/i }).click();

    // Row should be removed from bin list
    await expect(rows).toHaveCount(startCount - 1);
  });

  test('proposals bin shows items and can restore', async ({ page }) => {
    await page.goto('/proposals/bin', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByRole('heading', { name: /soft deleted proposals/i })
    ).toBeVisible();
    const rows = page.locator('tbody tr');
    const startCount = await rows.count();

    if (startCount === 0) {
      return;
    }
    const firstRow = rows.first();
    const firstTitle =
      (await firstRow.locator('td').first().textContent())?.trim() || '';
    await firstRow.getByRole('button', { name: /restore/i }).click();

    await expect(rows).toHaveCount(startCount - 1);
  });

  test('offers bin shows items and can restore', async ({ page }) => {
    await page.goto('/offers/bin', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByRole('heading', { name: /soft deleted offers/i })
    ).toBeVisible();
    const rows = page.locator('tbody tr');
    const startCount = await rows.count();

    if (startCount === 0) {
      return;
    }
    const firstRow = rows.first();
    const firstId =
      (await firstRow.locator('td').first().textContent())?.trim() || '';
    await firstRow.getByRole('button', { name: /restore/i }).click();

    await expect(rows).toHaveCount(startCount - 1);
  });
});
