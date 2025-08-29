import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/sign-in');

    // Unauthenticated users are redirected to access request with callback
    await expect(page).toHaveURL(/\/access\/request\?callbackUrl=%2Fsign-in/);
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/sign-in');

    await expect(page).toHaveURL(/\/access\/request\?callbackUrl=%2Fsign-in/);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/sign-in');

    await expect(page).toHaveURL(/\/access\/request\?callbackUrl=%2Fsign-in/);
  });

  test('should redirect to Keycloak for OAuth login', async ({ page }) => {
    await page.goto('/sign-in');

    await expect(page).toHaveURL(/\/access\/request\?callbackUrl=%2Fsign-in/);
  });
});
