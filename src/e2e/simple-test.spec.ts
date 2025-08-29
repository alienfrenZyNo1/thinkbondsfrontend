import { test, expect } from './fixtures';

test.describe('Simple Test', () => {
  test('should display simple test page with working button', async ({
    page,
  }) => {
    await page.goto('/access/request/simple-test-page');

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1');

    // Check that the page loaded correctly
    await expect(page.locator('h1')).toContainText('Simple Test Page');
    await expect(
      page.locator('text=This is a simple test page with a basic button')
    ).toBeVisible();

    // Check that the button is visible and has the correct initial text
    // Use a more specific selector to avoid the Next.js Dev Tools button
    const button = page.locator('button:has-text("Click me:")');
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Click me: 0');

    // Click the button and verify the count increases
    await button.click();
    await expect(button).toHaveText('Click me: 1');

    // Click again and verify
    await button.click();
    await expect(button).toHaveText('Click me: 2');
  });
});
