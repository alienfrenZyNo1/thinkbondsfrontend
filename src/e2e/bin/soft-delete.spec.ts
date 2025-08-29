import { test, expect } from '../fixtures';

test.describe('Soft Delete and Bin', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication as admin user before each test
    await page.goto('/dashboard');
  });

  test('should soft delete policyholder and move to bin', async ({ page }) => {
    await page.goto('/policyholders');
    
    // Find a policyholder and click delete
    const policyholderRow = page.locator('tbody tr').first();
    const policyholderName = await policyholderRow.locator('td').first().textContent();
    
    await policyholderRow.locator('button:has-text("Delete")').click();
    
    // Should show success message
    await expect(page.locator('.success-message')).toBeVisible();
    
    // Navigate to bin
    await page.goto('/policyholders/bin');
    
    // Deleted policyholder should be in bin
    await expect(page.locator('tbody tr')).toContainText(policyholderName || '');
  });

  test('should restore policyholder from bin', async ({ page }) => {
    await page.goto('/policyholders/bin');
    
    // Find a deleted policyholder and click restore
    const binRow = page.locator('tbody tr').first();
    const policyholderName = await binRow.locator('td').first().textContent();
    
    await binRow.locator('button:has-text("Restore")').click();
    
    // Should show success message
    await expect(page.locator('.success-message')).toBeVisible();
    
    // Navigate back to policyholders
    await page.goto('/policyholders');
    
    // Restored policyholder should be in main list
    await expect(page.locator('tbody tr')).toContainText(policyholderName || '');
  });

  test('should soft delete proposal and move to bin', async ({ page }) => {
    await page.goto('/proposals');
    
    // Find a proposal and click delete
    const proposalRow = page.locator('tbody tr').first();
    const proposalName = await proposalRow.locator('td').first().textContent();
    
    await proposalRow.locator('button:has-text("Delete")').click();
    
    // Should show success message
    await expect(page.locator('.success-message')).toBeVisible();
    
    // Navigate to bin
    await page.goto('/proposals/bin');
    
    // Deleted proposal should be in bin
    await expect(page.locator('tbody tr')).toContainText(proposalName || '');
  });

  test('should restore proposal from bin', async ({ page }) => {
    await page.goto('/proposals/bin');
    
    // Find a deleted proposal and click restore
    const binRow = page.locator('tbody tr').first();
    const proposalName = await binRow.locator('td').first().textContent();
    
    await binRow.locator('button:has-text("Restore")').click();
    
    // Should show success message
    await expect(page.locator('.success-message')).toBeVisible();
    
    // Navigate back to proposals
    await page.goto('/proposals');
    
    // Restored proposal should be in main list
    await expect(page.locator('tbody tr')).toContainText(proposalName || '');
  });

  test('should soft delete offer and move to bin', async ({ page }) => {
    await page.goto('/offers');
    
    // Find an offer and click delete
    const offerRow = page.locator('tbody tr').first();
    const offerName = await offerRow.locator('td').first().textContent();
    
    await offerRow.locator('button:has-text("Delete")').click();
    
    // Should show success message
    await expect(page.locator('.success-message')).toBeVisible();
    
    // Navigate to bin
    await page.goto('/offers/bin');
    
    // Deleted offer should be in bin
    await expect(page.locator('tbody tr')).toContainText(offerName || '');
  });

  test('should restore offer from bin', async ({ page }) => {
    await page.goto('/offers/bin');
    
    // Find a deleted offer and click restore
    const binRow = page.locator('tbody tr').first();
    const offerName = await binRow.locator('td').first().textContent();
    
    await binRow.locator('button:has-text("Restore")').click();
    
    // Should show success message
    await expect(page.locator('.success-message')).toBeVisible();
    
    // Navigate back to offers
    await page.goto('/offers');
    
    // Restored offer should be in main list
    await expect(page.locator('tbody tr')).toContainText(offerName || '');
  });

  test('should permanently delete item from bin', async ({ page }) => {
    await page.goto('/policyholders/bin');
    
    // Find a deleted policyholder and click permanent delete
    const binRow = page.locator('tbody tr').first();
    const policyholderName = await binRow.locator('td').first().textContent();
    
    await binRow.locator('button:has-text("Delete Permanently")').click();
    
    // Should show confirmation dialog
    await expect(page.locator('.confirmation-dialog')).toBeVisible();
    
    // Confirm deletion
    await page.locator('button:has-text("Confirm")').click();
    
    // Should show success message
    await expect(page.locator('.success-message')).toBeVisible();
    
    // Deleted policyholder should no longer be in bin
    await expect(page.locator('tbody tr')).not.toContainText(policyholderName || '');
  });
});