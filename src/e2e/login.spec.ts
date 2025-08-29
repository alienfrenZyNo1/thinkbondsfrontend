import { test, expect } from './fixtures';

test('should display login form', async ({ page }) => {
  await page.goto('/sign-in');
  
  // The sign-in page redirects to Keycloak, so we should check for the redirect
  await expect(page).toHaveURL(/api\/auth\/signin/);
});