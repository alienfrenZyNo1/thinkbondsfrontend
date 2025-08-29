import { test, expect } from '../fixtures';

test.describe('Edit History', () => {
  test.beforeEach(async ({ page }) => {
    // Auth is mocked as admin by default in fixtures
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  });

  test('should show edit history for policyholder', async ({ page }) => {
    await page.goto('/policyholders/1/history', {
      waitUntil: 'domcontentloaded',
    });

    await expect(page.locator('h2:has-text("Edit History")')).toBeVisible({
      timeout: 20000,
    });
    await expect(page.locator('table')).toBeVisible({ timeout: 20000 });

    const historyRows = page.locator('tbody tr');
    expect(await historyRows.count()).toBeGreaterThan(0);
  });

  test('should show edit history for proposal', async ({ page }) => {
    await page.goto('/proposals/1/history', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h2:has-text("Edit History")')).toBeVisible({
      timeout: 20000,
    });
    await expect(page.locator('table')).toBeVisible({ timeout: 20000 });
    const historyRows = page.locator('tbody tr');
    expect(await historyRows.count()).toBeGreaterThan(0);
  });

  test.skip('should show edit history for offer', async () => {
    // Offer detail/history pages not implemented
  });

  test.skip('should show edit history for broker', async () => {
    // Broker detail/history pages not implemented
  });

  test.skip('should show edit history for bond', async () => {
    // Bond detail/history pages not implemented
  });

  test.skip('should show detailed history entry', async () => {
    // Not implemented in current UI
  });
});
