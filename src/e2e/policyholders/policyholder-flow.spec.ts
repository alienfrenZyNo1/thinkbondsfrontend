import { test, expect } from '../fixtures';

test.describe('Policyholder Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard before each test
    await page.goto('/dashboard');
  });

  test('should navigate to policyholders page', async ({ page }) => {
    await page.goto('/policyholders');
    
    await expect(page.locator('h1')).toContainText('Policyholders');
    await expect(page.locator('button:has-text("Create Policyholder")')).toBeVisible();
  });

  test('should create new policyholder', async ({ page }) => {
    await page.goto('/policyholders');
    
    // Click create policyholder button
    await page.locator('button:has-text("Create Policyholder")').click();
    
    // Fill in the form
    await page.locator('input[name="companyName"]').fill('Test Company Ltd.');
    await page.locator('input[name="contactName"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john@testcompany.com');
    await page.locator('input[name="phone"]').fill('+44 1234 567890');
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Should show success message and redirect to policyholders list
    await expect(page.locator('.success-message')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Policyholders');
  });

  test('should approve pending policyholder', async ({ page }) => {
    await page.goto('/policyholders');
    
    // Find a pending policyholder
    const pendingRow = page.locator('tr:has-text("pending")').first();
    await expect(pendingRow).toBeVisible();
    
    // Click approve button
    await pendingRow.locator('button:has-text("Approve")').click();
    
    // Should show success message
    await expect(page.locator('.success-message')).toBeVisible();
    
    // Policyholder should now be approved
    await expect(pendingRow).not.toBeVisible();
  });

  test('should decline pending policyholder', async ({ page }) => {
    await page.goto('/policyholders');
    
    // Find a pending policyholder
    const pendingRow = page.locator('tr:has-text("pending")').first();
    await expect(pendingRow).toBeVisible();
    
    // Click decline button
    await pendingRow.locator('button:has-text("Decline")').click();
    
    // Should show success message
    await expect(page.locator('.success-message')).toBeVisible();
    
    // Policyholder should now be declined
    await expect(pendingRow).not.toBeVisible();
  });

  test('should view policyholder details', async ({ page }) => {
    await page.goto('/policyholders');
    
    // Click on a policyholder row to view details
    await page.locator('tbody tr').first().click();
    
    // Should navigate to policyholder details page
    await expect(page).toHaveURL(/policyholders\/[a-zA-Z0-9-]+/);
    await expect(page.locator('h1')).toContainText('Policyholder Details');
  });

  test('should edit policyholder', async ({ page }) => {
    await page.goto('/policyholders');
    
    // Click on a policyholder row to view details
    await page.locator('tbody tr').first().click();
    
    // Click edit button
    await page.locator('button:has-text("Edit")').click();
    
    // Modify some fields
    await page.locator('input[name="phone"]').fill('+44 9876 543210');
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Should show success message
    await expect(page.locator('.success-message')).toBeVisible();
  });
});