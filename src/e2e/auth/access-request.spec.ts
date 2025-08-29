import { test, expect } from '../fixtures';

test.describe('Access Request Flow', () => {
  test('should display access request form', async ({ page }) => {
    await page.goto('/access/request');
    await expect(
      page.getByRole('heading', { name: /request access/i })
    ).toBeVisible();
    await expect(page.getByLabel('Broker Email')).toBeVisible();
    await expect(page.getByLabel('Country')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /request access/i })
    ).toBeVisible();
  });

  test('should submit access request with valid data', async ({ page }) => {
    await page.goto('/access/request');
    await page.getByLabel('Broker Email').fill('newuser@example.com');
    await page.getByLabel('Country').fill('United Kingdom');
    await page.getByRole('button', { name: /request access/i }).click();

    // Success view
    await expect(
      page.getByRole('heading', { name: /access request successful/i })
    ).toBeVisible();
    await expect(page.locator('text=Access Code:')).toBeVisible();
  });

  test('should show error with invalid email', async ({ page }) => {
    await page.goto('/access/request');
    await page.getByLabel('Broker Email').fill('invalid-email');
    await page.getByLabel('Country').fill('United Kingdom');
    await page.getByRole('button', { name: /request access/i }).click();

    // Client-side validation message
    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

  test('should require country selection', async ({ page }) => {
    await page.goto('/access/request');
    await page.getByLabel('Broker Email').fill('newuser@example.com');
    await page.getByRole('button', { name: /request access/i }).click();

    await expect(page.getByText('Country is required')).toBeVisible();
  });
});
