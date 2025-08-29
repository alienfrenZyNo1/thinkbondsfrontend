import { test, expect } from '@playwright/test';

test.describe('Proposal Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as broker user before each test
    await page.goto('/login');
    await page.locator('input[type="email"]').fill('broker@example.com');
    await page.locator('input[type="password"]').fill('broker123');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/dashboard');
  });

  test('should navigate to proposals page', async ({ page }) => {
    await page.goto('/proposals');
    
    await expect(page.locator('h1')).toContainText('Proposals');
    await expect(page.locator('button:has-text("Create Proposal")')).toBeVisible();
  });

  test('should create new proposal through wizard', async ({ page }) => {
    await page.goto('/proposals');
    
    // Click create proposal button
    await page.locator('button:has-text("Create Proposal")').click();
    
    // Should navigate to new proposal page
    await expect(page).toHaveURL(/proposals\/new/);
    
    // Fill in step 1: Proposal details
    await page.locator('input[name="title"]').fill('Test Proposal');
    await page.locator('textarea[name="description"]').fill('Test proposal description');
    
    // Click next
    await page.locator('button:has-text("Next")').click();
    
    // Fill in step 2: Select policyholder
    await page.locator('select[name="policyholderId"]').selectOption({ index: 1 });
    
    // Click next
    await page.locator('button:has-text("Next")').click();
    
    // Fill in step 3: Review and submit
    await expect(page.locator('h2')).toContainText('Review Proposal');
    
    // Submit the proposal
    await page.locator('button:has-text("Submit Proposal")').click();
    
    // Should show success message and redirect to proposals list
    await expect(page.locator('.success-message')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Proposals');
  });

  test('should create offer from proposal', async ({ page }) => {
    await page.goto('/proposals');
    
    // Find a proposal and click on it
    await page.locator('tbody tr').first().click();
    
    // Should navigate to proposal details page
    await expect(page).toHaveURL(/proposals\/[a-zA-Z0-9-]+/);
    
    // Click create offer button
    await page.locator('button:has-text("Create Offer")').click();
    
    // Fill in offer details
    await page.locator('input[name="bondAmount"]').fill('1000');
    await page.locator('input[name="premium"]').fill('50');
    await page.locator('textarea[name="terms"]').fill('Standard terms and conditions');
    await page.locator('input[name="effectiveDate"]').fill('2023-01-01');
    await page.locator('input[name="expiryDate"]').fill('2024-01-01');
    
    // Submit the offer
    await page.locator('button[type="submit"]').click();
    
    // Should show success message
    await expect(page.locator('.success-message')).toBeVisible();
  });

  test('should accept offer with OTP', async ({ page }) => {
    // This test would simulate the public acceptance flow
    // In a real test, we would need to get the acceptance token from the offer
    
    // For now, we'll test the OTP verification page directly
    await page.goto('/accept/test-token-123');
    
    await expect(page.locator('h1')).toContainText('Accept Offer');
    await expect(page.locator('input[name="otp"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Enter valid OTP (in development mode, this is hardcoded to 123456)
    await page.locator('input[name="otp"]').fill('123456');
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Should show success message and PDF link
    await expect(page.locator('.success-message')).toBeVisible();
    await expect(page.locator('a:has-text("Download Bond PDF")')).toBeVisible();
  });

  test('should show error with invalid OTP', async ({ page }) => {
    await page.goto('/accept/test-token-123');
    
    // Enter invalid OTP
    await page.locator('input[name="otp"]').fill('000000');
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Should show error message
    await expect(page.locator('.error-message')).toBeVisible();
  });
});