import { test as base } from '@playwright/test';
import { server } from '../mocks/server';
import { mockAuthentication } from './mocks';

export * from '@playwright/test';

// Mock authentication with admin role (default)
export const test = base.extend({
  page: async ({ page }, use) => {
    // Enable API mocking before each test
    server.listen();

    // Mock authentication for the test with admin role (default)
    await mockAuthentication(page, 'admin');

    await use(page);

    // Clean up after each test
    server.resetHandlers();
  },
});

// Test with broker role
export const testAsBroker = base.extend({
  page: async ({ page }, use) => {
    // Enable API mocking before each test
    server.listen();

    // Mock authentication for the test with broker role
    await mockAuthentication(page, 'broker');

    await use(page);

    // Clean up after each test
    server.resetHandlers();
  },
});

// Test with policyholder role
export const testAsPolicyholder = base.extend({
  page: async ({ page }, use) => {
    // Enable API mocking before each test
    server.listen();

    // Mock authentication for the test with policyholder role
    await mockAuthentication(page, 'policyholder');

    await use(page);

    // Clean up after each test
    server.resetHandlers();
  },
});

// Add global setup and teardown hooks
export const mochaHooks = {
  beforeAll() {
    // Start the server before all tests
    server.listen();
  },
  afterAll() {
    // Close the server after all tests
    server.close();
  },
};
