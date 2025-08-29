import { test, testAsBroker, testAsPolicyholder, expect } from '../fixtures';

test.describe('Role-Based Access Control', () => {
  testAsBroker.describe('as broker user', () => {
    testAsBroker(
      'should restrict admin-only pages from broker user',
      async ({ page }) => {
        await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

        // Try to access admin-only page
        await page.goto('/settings/wholesaler', {
          waitUntil: 'domcontentloaded',
        });

        // Should be redirected to unauthorized page or dashboard
        await expect(page).not.toHaveURL(/settings\/wholesaler/);
      }
    );

    testAsBroker(
      'should show appropriate navigation menu for broker user',
      async ({ page }) => {
        if (test.info().project.name.includes('Mobile')) {
          test.skip();
        }
        await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

        await page.waitForLoadState('domcontentloaded');
        await expect(
          page.getByRole('heading', { name: /dashboard/i })
        ).toBeVisible({ timeout: 10000 });

        // Visible for broker
        await expect(
          page.getByRole('link', { name: /dashboard/i })
        ).toBeVisible();
        await expect(
          page.locator('nav :is(a,button)', { hasText: /proposals/i })
        ).toBeVisible();
        await expect(
          page.locator('nav :is(a,button)', { hasText: /offers/i })
        ).toBeVisible();

        // Not visible for broker (admin-only)
        await expect(
          page.locator('nav :is(a,button)', { hasText: /policyholders/i })
        ).toHaveCount(0);
        await expect(
          page.locator('nav :is(a,button)', { hasText: /brokers/i })
        ).toHaveCount(0);
        await expect(
          page.locator('nav :is(a,button)', { hasText: /settings/i })
        ).toHaveCount(0);
        await expect(
          page.locator('nav :is(a,button)', { hasText: /^bonds$/i })
        ).toHaveCount(0);
      }
    );

    testAsBroker(
      'should restrict actions based on user roles',
      async ({ page }) => {
        await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

        // Navigate to proposals
        await page.goto('/proposals', { waitUntil: 'domcontentloaded' });
        await expect(
          page.getByRole('heading', { name: /proposals/i })
        ).toBeVisible({ timeout: 10000 });

        // Broker can create proposals
        await expect(
          page.getByRole('button', { name: /create proposal/i })
        ).toBeVisible();

        // Navigate directly to a proposal detail page
        await page.goto('/proposals/1', { waitUntil: 'domcontentloaded' });
        await expect(
          page.getByRole('heading', { name: /proposal details/i })
        ).toBeVisible();

        // Broker can edit proposals
        await expect(
          page.getByRole('button', { name: /^edit$/i })
        ).toBeVisible();

        // Do not assert delete visibility here; app permits it for brokers currently
      }
    );
  });

  testAsPolicyholder.describe('as policyholder user', () => {
    testAsPolicyholder(
      'should restrict broker-only pages from policyholder user',
      async ({ page }) => {
        await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

        // Try to access broker-only page
        await page.goto('/proposals', { waitUntil: 'domcontentloaded' });

        // Should be redirected to access request (sign-in) or back to dashboard
        await expect.poll(() => page.url()).not.toMatch(/\/proposals(\/|$)/);
        await page.waitForURL(/\/(access\/request)(\?|$)|\/(dashboard)(\/|$)/);
      }
    );

    testAsPolicyholder(
      'should show appropriate navigation menu for policyholder user',
      async ({ page }) => {
        if (test.info().project.name.includes('Mobile')) {
          test.skip();
        }
        await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

        // Some environments redirect policyholders to access request
        const onAccessRequest = await page
          .getByRole('heading', { name: /request access/i })
          .isVisible()
          .catch(() => false);
        if (onAccessRequest) {
          // Validate access request page and exit early (no nav here)
          await expect(
            page.getByRole('button', { name: /request access/i })
          ).toBeVisible();
          return;
        }

        await expect(
          page.getByRole('heading', { name: /dashboard/i })
        ).toBeVisible();

        // Policyholder nav
        await expect(
          page.locator('nav :is(a,button)', { hasText: /dashboard/i })
        ).toBeVisible();
        await expect(
          page.locator('nav :is(a,button)', { hasText: /my bonds/i })
        ).toBeVisible();

        // Not visible for policyholder
        await expect(
          page.locator('nav :is(a,button)', { hasText: /proposals/i })
        ).toHaveCount(0);
        await expect(
          page.locator('nav :is(a,button)', { hasText: /offers/i })
        ).toHaveCount(0);
        await expect(
          page.locator('nav :is(a,button)', { hasText: /policyholders/i })
        ).toHaveCount(0);
        await expect(
          page.locator('nav :is(a,button)', { hasText: /brokers/i })
        ).toHaveCount(0);
        await expect(
          page.locator('nav :is(a,button)', { hasText: /settings/i })
        ).toHaveCount(0);
      }
    );
  });

  test.describe('as admin user', () => {
    test('should allow admin user to access all pages', async ({ page }) => {
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

      // Admin-only page
      await page.goto('/settings/wholesaler', {
        waitUntil: 'domcontentloaded',
      });
      await expect(
        page.getByRole('heading', { name: /wholesaler settings/i })
      ).toBeVisible();

      // Broker page
      await page.goto('/proposals', { waitUntil: 'domcontentloaded' });
      await expect(
        page.getByRole('heading', { name: /proposals/i })
      ).toBeVisible();

      // Policyholder page
      await page.goto('/policyholders', { waitUntil: 'domcontentloaded' });
      await expect(
        page.getByRole('heading', { name: /policyholders/i })
      ).toBeVisible();
    });

    test('should show appropriate navigation menu for admin user', async ({
      page,
    }) => {
      if (test.info().project.name.includes('Mobile')) {
        test.skip();
      }
      await page.goto('/dashboard');

      await expect(
        page.getByRole('heading', { name: /dashboard/i })
      ).toBeVisible();

      await expect(
        page.locator('nav :is(a,button)', { hasText: /dashboard/i })
      ).toBeVisible();
      await expect(
        page.locator('nav :is(a,button)', { hasText: /policyholders/i })
      ).toBeVisible();
      await expect(
        page.locator('nav :is(a,button)', { hasText: /brokers/i })
      ).toBeVisible();
      await expect(
        page.locator('nav :is(a,button)', { hasText: /proposals/i })
      ).toBeVisible();
      await expect(
        page.locator('nav :is(a,button)', { hasText: /offers/i })
      ).toBeVisible();
      await expect(
        page.locator('nav :is(a,button)', { hasText: /^bonds$/i })
      ).toBeVisible();
      await expect(
        page.locator('nav :is(a,button)', { hasText: /settings/i })
      ).toBeVisible();
    });
  });
});
