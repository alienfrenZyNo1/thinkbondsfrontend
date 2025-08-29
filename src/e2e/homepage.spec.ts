import { test, expect } from './fixtures';

test('should display homepage with form and data', async ({ page }) => {
  await page.goto('/');

  // Check that the page title is correct
  await expect(page).toHaveTitle(/ThinkBonds Portal/);

  // Check that the welcome message is visible
  await expect(
    page.locator('h1:has-text("Welcome to ThinkBonds Portal")')
  ).toBeVisible();

  // Check that the description text is visible
  await expect(
    page.locator(
      'text=Please sign in to access your dashboard and manage your policies.'
    )
  ).toBeVisible();

  // Check that the Sign In button is visible
  await expect(page.locator('button:has-text("Sign In")')).toBeVisible();

  // Check that the Request Access button is visible
  await expect(page.locator('button:has-text("Request Access")')).toBeVisible();

  // Check that the Register as Broker button is visible
  await expect(
    page.locator('button:has-text("Register as Broker")')
  ).toBeVisible();
});
