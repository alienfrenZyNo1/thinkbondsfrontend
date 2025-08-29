import { test, expect } from '../fixtures';

test.describe('Access Request Flow', () => {
  test('should display access request form', async ({ page }) => {
    await page.goto('/access/request');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1');
    
    await expect(page.locator('h1')).toContainText('Request Access');
    await expect(page.locator('input[placeholder="Enter your email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter your country"]')).toBeVisible();
    await expect(page.locator('button:has-text("Request Access")')).toBeVisible();
  });

  test('should submit access request with valid data', async ({ page }) => {
    await page.goto('/access/request');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1');
    
    // Fill in the form
    await page.locator('input[placeholder="Enter your email"]').fill('newuser@example.com');
    await page.locator('input[placeholder="Enter your country"]').fill('United Kingdom');
    
    // Submit the form
    await page.locator('button:has-text("Request Access")').click();
    
    // Wait for success message
    await page.waitForSelector('text=Access Request Submitted');
    
    // Should show success message
    await expect(page.locator('text=Access Request Submitted')).toBeVisible();
    await expect(page.locator('text=Check your email for a link and 6-digit PIN to complete your registration.')).toBeVisible();
  });

  test('should show error with invalid email', async ({ page }) => {
    await page.goto('/access/request');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1');
    
    // Fill in the form with invalid email
    await page.locator('input[placeholder="Enter your email"]').fill('invalid-email');
    await page.locator('input[placeholder="Enter your country"]').fill('United Kingdom');
    
    // Submit the form
    await page.locator('button:has-text("Request Access")').click();
    
    // Wait for error message
    await page.waitForSelector('.text-red-700');
    
    // Should show error message
    await expect(page.locator('.text-red-700')).toBeVisible();
  });

  test('should require country selection', async ({ page }) => {
    await page.goto('/access/request');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1');
    
    // Fill in the form without selecting country
    await page.locator('input[placeholder="Enter your email"]').fill('newuser@example.com');
    
    // Submit the form
    await page.locator('button:has-text("Request Access")').click();
    
    // Wait for error message
    await page.waitForSelector('.text-red-700');
    
    // Should show error message
    await expect(page.locator('.text-red-700')).toBeVisible();
  });
});