import { test, testAsBroker, expect } from '../fixtures';

test.describe('Proposal Flow', () => {
  // Authentication is mocked via fixtures (broker by default where needed)

  testAsBroker('should navigate to proposals page', async ({ page }) => {
    await page.goto('/proposals');

    await expect(page.locator('h1')).toContainText('Proposals');
    await expect(
      page.locator('button:has-text("Create Proposal")')
    ).toBeVisible();
  });

  testAsBroker(
    'should create new proposal through wizard',
    async ({ page }) => {
      await page.goto('/proposals');

      // Click create proposal button
      await page.locator('button:has-text("Create Proposal")').click();

      // Should navigate to new proposal page
      await expect(page).toHaveURL(/proposals\/new/);

      // Step 1: Policyholder Information (fill minimal required fields)
      await page.getByLabel('Company Name', { exact: false }).fill('Acme Corp');
      await page
        .getByLabel('Company Number', { exact: false })
        .fill('AC123456');
      await page
        .getByLabel('Contact Name', { exact: false })
        .fill('Alice Smith');
      await page
        .getByLabel('Email', { exact: false })
        .fill('alice@example.com');
      await page.getByLabel('Phone', { exact: false }).fill('+441234567890');
      await page.getByLabel('Address', { exact: false }).fill('1 Main St');
      await page.getByLabel('City', { exact: false }).fill('London');
      await page.getByLabel('Postcode', { exact: false }).fill('SW1A 1AA');
      await page.getByLabel('Country', { exact: false }).fill('UK');

      // Next to Contract
      await page
        .getByRole('button', { name: 'Next: Contract Information' })
        .click();

      // Step 2: Contract Information
      await page
        .getByLabel('Proposal Title', { exact: false })
        .fill('Test Proposal');
      await page
        .getByLabel('Description', { exact: false })
        .fill('Test proposal description');
      await page.getByLabel('Start Date', { exact: false }).fill('2025-09-01');
      await page.getByLabel('End Date', { exact: false }).fill('2026-09-01');
      await page.getByLabel('Amount', { exact: false }).fill('10000');

      await page
        .getByRole('button', { name: 'Next: Beneficiary Information' })
        .click();

      // Step 3: Beneficiary Information
      await page
        .getByLabel('Company Name', { exact: false })
        .fill('Beneficiary Ltd');
      await page
        .getByLabel('Company Number', { exact: false })
        .fill('BN987654');
      await page.getByLabel('Contact Name', { exact: false }).fill('Bob Jones');
      await page.getByLabel('Email', { exact: false }).fill('bob@example.com');
      await page.getByLabel('Phone', { exact: false }).fill('+44111222333');
      await page.getByLabel('Address', { exact: false }).fill('2 King St');
      await page.getByLabel('City', { exact: false }).fill('Manchester');
      await page.getByLabel('Postcode', { exact: false }).fill('M1 1AA');
      await page.getByLabel('Country', { exact: false }).fill('UK');

      // Submit
      await page.getByRole('button', { name: 'Submit Proposal' }).click();

      // Redirects back to proposals
      await expect(page).toHaveURL(/\/proposals(\/|$)/);
      await expect(
        page.getByRole('heading', { name: /proposals/i })
      ).toBeVisible();
    }
  );

  test('should create offer from proposal (admin)', async ({ page }) => {
    // Default fixture mocks admin auth
    await page.goto('/proposals/1/offer');
    await expect(
      page.getByRole('heading', { name: 'Create Bond Offer', level: 1 })
    ).toBeVisible();
    // Wait for proposal to load so hidden proposalId is set
    await expect(
      page.getByRole('heading', { name: 'Proposal Information', exact: true })
    ).toBeVisible();

    // Fill in offer form by labels
    await page.getByLabel('Bond Amount').fill('1000');
    await page.getByLabel('Premium').fill('50');
    await page.getByLabel('Effective Date').fill('2025-09-01');
    await page.getByLabel('Expiry Date').fill('2026-09-01');
    await page
      .getByLabel('Terms and Conditions')
      .fill('Standard terms and conditions');
    // Ensure hidden proposalId is set by the page
    await expect(page.locator('input[name="proposalId"]')).toHaveValue(/.+/, {
      timeout: 10000,
    });

    await page.getByRole('button', { name: /^create offer$/i }).click();

    // Success banner appears on the create-offer page
    await expect(page.locator('text=Offer created successfully')).toBeVisible({
      timeout: 10000,
    });
  });

  test('should show OTP verification screen for acceptance', async ({
    page,
    context,
  }) => {
    // Render OTP screen
    await context.clearCookies();
    await page.goto('/accept/test-token-123');
    await expect(
      page.getByRole('heading', { name: /verify your identity/i })
    ).toBeVisible();

    // Enter valid OTP (dev shortcut)
    await page.getByLabel('Verification Code').fill('123456');
    await page.getByRole('button', { name: /verify code/i }).click();

    // In e2e we allow proceeding without a real token; expect certificate view
    await expect(
      page.getByRole('heading', { name: 'Bond Certificate', exact: true })
    ).toBeVisible();
  });

  test('should show error with invalid OTP', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/accept/test-token-123');

    await page.getByLabel('Verification Code').fill('000000');
    await page.getByRole('button', { name: /verify code/i }).click();

    await expect(page.locator('text=Invalid code')).toBeVisible();
  });
});
