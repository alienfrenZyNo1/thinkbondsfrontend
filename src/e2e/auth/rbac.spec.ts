import { test, testAsBroker, testAsPolicyholder, expect } from '../fixtures';

test.describe('Role-Based Access Control', () => {
  testAsBroker.describe('as broker user', () => {
    testAsBroker('should restrict admin-only pages from broker user', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Try to access admin-only page
      await page.goto('/settings/wholesaler');
      
      // Should be redirected to unauthorized page or dashboard
      await expect(page).not.toHaveURL(/settings\/wholesaler/);
    });

    testAsBroker('should show appropriate navigation menu for broker user', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Debug: Print page content
      const bodyContent = await page.locator('body').textContent();
      console.log('Page body content:', bodyContent?.substring(0, 500));
      
      // Debug: Check if we're on the dashboard page
      const currentUrl = page.url();
      console.log('Current URL:', currentUrl);
      
      // Debug: Check if there's any h1 element
      const h1Count = await page.locator('h1').count();
      console.log('Number of h1 elements:', h1Count);
      
      if (h1Count > 0) {
        const h1Text = await page.locator('h1').first().textContent();
        console.log('First h1 text:', h1Text);
      }

      // First, ensure the page has loaded and any redirects have settled
      await page.waitForLoadState('domcontentloaded');
      await page.waitForURL('http://localhost:3000/dashboard'); // Explicitly wait for the dashboard URL

      // Then, assert the heading visibility with increased timeout
      await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible({ timeout: 10000 });

      // Check that broker navigation items are visible
      await expect(page.locator('nav a:has-text("Dashboard")')).toBeVisible();
      await expect(page.locator('nav a:has-text("Proposals")')).toBeVisible();
      await expect(page.locator('nav a:has-text("Offers")')).toBeVisible();
      
      // Check that admin-only items are not visible
      await expect(page.locator('nav a:has-text("Policyholders")')).not.toBeVisible();
      await expect(page.locator('nav a:has-text("Brokers")')).not.toBeVisible();
      await expect(page.locator('nav a:has-text("Settings")')).not.toBeVisible();
    });

    testAsBroker('should restrict actions based on user roles', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Navigate to proposals
      await page.goto('/proposals');
      
      // Wait for page to load
      await expect(page.getByRole('heading', { name: /proposals/i })).toBeVisible();
      
      // Check that broker can create proposals
      await expect(page.locator('button:has-text("Create Proposal")')).toBeVisible();
      
      // Navigate to a proposal detail page
      await page.locator('tbody tr').first().click();
      
      // Wait for page to load
      await expect(page.getByRole('heading', { name: /proposal details/i })).toBeVisible();
      
      // Check that broker can edit their own proposals
      await expect(page.locator('button:has-text("Edit")')).toBeVisible();
      
      // Check that broker cannot delete proposals (admin only)
      await expect(page.locator('button:has-text("Delete")')).not.toBeVisible();
    });
  });

  testAsPolicyholder.describe('as policyholder user', () => {
    testAsPolicyholder('should restrict broker-only pages from policyholder user', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Try to access broker-only page
      await page.goto('/proposals');
      
      // Should be redirected to unauthorized page or dashboard
      await expect(page).not.toHaveURL(/proposals/);
    });

    testAsPolicyholder('should show appropriate navigation menu for policyholder user', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Wait for page to load
      await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
      
      // Check that policyholder navigation items are visible
      await expect(page.locator('nav a:has-text("Dashboard")')).toBeVisible();
      await expect(page.locator('nav a:has-text("My Bonds")')).toBeVisible();
      
      // Check that broker and admin items are not visible
      await expect(page.locator('nav a:has-text("Proposals")')).not.toBeVisible();
      await expect(page.locator('nav a:has-text("Offers")')).not.toBeVisible();
      await expect(page.locator('nav a:has-text("Policyholders")')).not.toBeVisible();
      await expect(page.locator('nav a:has-text("Brokers")')).not.toBeVisible();
      await expect(page.locator('nav a:has-text("Settings")')).not.toBeVisible();
    });
  });

  test.describe('as admin user', () => {
    test('should allow admin user to access all pages', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Try to access admin-only page
      await page.goto('/settings/wholesaler');
      await expect(page).toHaveURL(/settings\/wholesaler/);
      
      // Try to access broker page
      await page.goto('/proposals');
      await expect(page).toHaveURL(/proposals/);
      
      // Try to access policyholder page
      await page.goto('/policyholders');
      await expect(page).toHaveURL(/policyholders/);
    });

    test('should show appropriate navigation menu for admin user', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Wait for page to load
      await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
      
      // Check that admin navigation items are visible
      await expect(page.locator('nav a:has-text("Dashboard")')).toBeVisible();
      await expect(page.locator('nav a:has-text("Policyholders")')).toBeVisible();
      await expect(page.locator('nav a:has-text("Brokers")')).toBeVisible();
      await expect(page.locator('nav a:has-text("Proposals")')).toBeVisible();
      await expect(page.locator('nav a:has-text("Offers")')).toBeVisible();
      await expect(page.locator('nav a:has-text("Bonds")')).toBeVisible();
      await expect(page.locator('nav a:has-text("Settings")')).toBeVisible();
    });
  });
});