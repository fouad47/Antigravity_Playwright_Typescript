/**
 * ============================================================
 * CHAPTER 01: TEST STRUCTURE & ORGANIZATION
 * ============================================================
 *
 * 📚 LEARNING OBJECTIVES:
 * - Organize tests with test.describe()
 * - Use test.skip(), test.only(), test.fixme()
 * - Add tags and annotations
 * - Understand test execution order
 * ============================================================
 */

import { test, expect } from '@playwright/test';

/**
 * 📚 test.describe()
 * Groups related tests into a suite/block.
 * Benefits:
 * 1. Logical organization
 * 2. Shared hooks (beforeEach, afterEach)
 * 3. Better reporting output
 * 4. Can be nested for sub-groups
 *
 * 💡 BEST PRACTICE:
 * Name describe blocks after the feature/page being tested.
 */
test.describe('Home Page Tests', () => {
  /**
   * 📚 test.beforeEach()
   * Runs before EVERY test in this describe block.
   * Perfect for common setup like navigation.
   */
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/');
    console.log('🔧 Setup: Navigated to home page');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page).toHaveTitle('The Internet');
  });

  test('should display the heading', async ({ page }) => {
    await expect(page.locator('h1.heading')).toBeVisible();
  });

  test('should have examples listed', async ({ page }) => {
    const links = page.locator('#content ul li a');
    expect(await links.count()).toBeGreaterThan(0);
  });
});

/**
 * 📚 NESTED DESCRIBE BLOCKS
 * You can nest describe blocks for more granular organization.
 */
test.describe('Navigation Tests', () => {
  test.describe('Main Navigation', () => {
    test('should navigate from home to login', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: 'Form Authentication' }).click();
      await expect(page).toHaveURL(/\/login/);
    });

    test('should navigate from home to checkboxes', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: 'Checkboxes' }).click();
      await expect(page).toHaveURL(/\/checkboxes/);
    });
  });

  test.describe('Back Navigation', () => {
    test('should go back to home page', async ({ page }) => {
      await page.goto('/');
      await page.goto('/login');
      await page.goBack();
      await expect(page).toHaveURL(/the-internet\.herokuapp\.com\/?$/);
    });
  });
});

/**
 * 📚 TEST ANNOTATIONS
 *
 * test.skip() - Skip a test (e.g., known bug, not yet implemented)
 * test.fixme() - Mark a test as needing fix (skips but documents intent)
 * test.slow() - Triple the test timeout
 * test.fail() - Expect the test to fail (inverted assertion)
 *
 * ⚠️ ANTI-PATTERN: Don't leave test.only() in committed code!
 * It causes only that test to run, masking failures in other tests.
 */
test.describe('Test Annotations Demo', () => {
  // This test will be skipped
  test.skip('should be skipped - feature not yet implemented', async ({ page }) => {
    await page.goto('/');
    // This won't run
  });

  // This test is marked as needing attention
  test.fixme('should handle edge case - needs investigation', async ({ page }) => {
    await page.goto('/');
    // This won't run but is flagged for fixing
  });

  // This test gets extra time (3x timeout)
  test('should handle slow page load @slow', async ({ page }) => {
    test.slow(); // Triples the timeout
    await page.goto('/');
    await expect(page).toHaveTitle('The Internet');
  });
});

/**
 * 📚 TAGGED TESTS
 * Use tags in test names to filter execution:
 *
 * Run only smoke tests:
 *   npx playwright test --grep @smoke
 *
 * Exclude regression tests:
 *   npx playwright test --grep-invert @regression
 */
test.describe('Tagged Tests', () => {
  test('should verify home page loads @smoke', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('The Internet');
  });

  test('should verify all links are present @regression', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('#content ul li a');
    const count = await links.count();
    expect(count).toBeGreaterThan(20);
  });

  test('should verify footer is present @smoke @regression', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('#page-footer');
    await expect(footer).toBeVisible();
  });
});
