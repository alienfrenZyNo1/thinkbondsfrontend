import { test } from './fixtures';

test('debug access request page', async ({ page }) => {
  await page.goto('/access/request');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Get page title
  const title = await page.title();
  console.log('Page title:', title);

  // Get page content
  const content = await page.content();
  console.log('Page content:', content.substring(0, 1000));

  // Take a screenshot
  await page.screenshot({ path: 'debug-access-request.png' });

  // Check for h1 element
  const h1Text = await page.locator('h1').textContent();
  console.log('H1 text:', h1Text);
});
