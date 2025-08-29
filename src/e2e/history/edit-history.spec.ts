import { test, expect } from '../fixtures';

test.describe('Edit History', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication as admin user before each test
    await page.goto('/dashboard');
  });

  test('should show edit history for policyholder', async ({ page }) => {
    await page.goto('/policyholders');
    
    // Click on a policyholder row to view details
    await page.locator('tbody tr').first().click();
    
    // Should navigate to policyholder details page
    await expect(page).toHaveURL(/policyholders\/[a-zA-Z0-9-]+/);
    
    // Click on History tab
    await page.locator('button:has-text("History")').click();
    
    // Should show edit history table
    await expect(page.locator('h2:has-text("Edit History")')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    
    // Should show at least one history entry
    const historyRows = page.locator('tbody tr');
    await expect(historyRows).toHaveCount(1);
  });

  test('should show edit history for proposal', async ({ page }) => {
    await page.goto('/proposals');
    
    // Click on a proposal row to view details
    await page.locator('tbody tr').first().click();
    
    // Should navigate to proposal details page
    await expect(page).toHaveURL(/proposals\/[a-zA-Z0-9-]+/);
    
    // Click on History tab
    await page.locator('button:has-text("History")').click();
    
    // Should show edit history table
    await expect(page.locator('h2:has-text("Edit History")')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('should show edit history for offer', async ({ page }) => {
    await page.goto('/offers');
    
    // Click on an offer row to view details
    await page.locator('tbody tr').first().click();
    
    // Should navigate to offer details page
    await expect(page).toHaveURL(/offers\/[a-zA-Z0-9-]+/);
    
    // Click on History tab
    await page.locator('button:has-text("History")').click();
    
    // Should show edit history table
    await expect(page.locator('h2:has-text("Edit History")')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('should show edit history for broker', async ({ page }) => {
    await page.goto('/brokers');
    
    // Click on a broker row to view details
    await page.locator('tbody tr').first().click();
    
    // Should navigate to broker details page
    await expect(page).toHaveURL(/brokers\/[a-zA-Z0-9-]+/);
    
    // Click on History tab
    await page.locator('button:has-text("History")').click();
    
    // Should show edit history table
    await expect(page.locator('h2:has-text("Edit History")')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('should show edit history for bond', async ({ page }) => {
    await page.goto('/bonds');
    
    // Click on a bond row to view details
    await page.locator('tbody tr').first().click();
    
    // Should navigate to bond details page
    await expect(page).toHaveURL(/bonds\/[a-zA-Z0-9-]+/);
    
    // Click on History tab
    await page.locator('button:has-text("History")').click();
    
    // Should show edit history table
    await expect(page.locator('h2:has-text("Edit History")')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('should show detailed history entry', async ({ page }) => {
    await page.goto('/policyholders');
    
    // Click on a policyholder row to view details
    await page.locator('tbody tr').first().click();
    
    // Click on History tab
    await page.locator('button:has-text("History")').click();
    
    // Click on a history entry to view details
    await page.locator('tbody tr').first().click();
    
    // Should show history entry details
    await expect(page.locator('.history-details')).toBeVisible();
    await expect(page.locator('.history-details h3')).toBeVisible();
 });
});