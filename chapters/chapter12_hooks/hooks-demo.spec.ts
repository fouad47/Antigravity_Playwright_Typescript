/**
 * ============================================================
 * CHAPTER 12: TEST HOOKS
 * ============================================================
 *
 * 📚 HOOK EXECUTION ORDER:
 *
 * beforeAll()    → Runs ONCE before all tests in a describe
 * ├── beforeEach() → Runs before EACH test
 * │   ├── test()   → The actual test
 * │   └── afterEach()  → Runs after EACH test (even on failure)
 * └── afterAll()   → Runs ONCE after all tests in a describe
 *
 * 💡 BEST PRACTICES:
 * - beforeAll: Database seeding, server setup, shared state
 * - beforeEach: Page navigation, clean state per test
 * - afterEach: Screenshots on failure, cleanup data
 * - afterAll: Close connections, clean up shared resources
 * ============================================================
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Hook Basics', () => {
  /**
   * 📚 test.beforeAll()
   * Runs once before ALL tests in this describe block.
   * Use for expensive one-time setup.
   *
   * ⚠️ NOTE: No 'page' fixture in beforeAll!
   * The page is created per-test. Use 'browser' if needed.
   */
  test.beforeAll(async () => {
    console.log('\n🔧 beforeAll: Setting up test suite');
    console.log('   (Runs ONCE before all tests)');
  });

  /**
   * 📚 test.beforeEach()
   * Runs before EVERY test in this describe block.
   * Gets the same fixtures as tests (page, context, etc.).
   */
  test.beforeEach(async ({ page }) => {
    console.log('\n🔧 beforeEach: Setting up test');
    console.log('   (Runs before EACH test)');
    await page.goto('/');
  });

  /**
   * 📚 test.afterEach()
   * Runs after EVERY test, even if the test fails.
   * Perfect for cleanup and failure reporting.
   */
  test.afterEach(async ({ page }, testInfo) => {
    console.log(`\n🧹 afterEach: Cleaning up after "${testInfo.title}"`);
    console.log(`   Status: ${testInfo.status}`);

    // Screenshot on failure
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot();
      await testInfo.attach('failure-screenshot', {
        body: screenshot,
        contentType: 'image/png',
      });
      console.log('   📸 Failure screenshot attached');
    }
  });

  /**
   * 📚 test.afterAll()
   * Runs once after ALL tests in this describe block.
   * Use for cleaning up shared resources.
   */
  test.afterAll(async () => {
    console.log('\n🧹 afterAll: Tearing down test suite');
    console.log('   (Runs ONCE after all tests)');
  });

  test('Test 1 - should see the home page', async ({ page }) => {
    console.log('   🧪 Running Test 1');
    await expect(page).toHaveTitle('The Internet');
  });

  test('Test 2 - should see the heading', async ({ page }) => {
    console.log('   🧪 Running Test 2');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Test 3 - should have links', async ({ page }) => {
    console.log('   🧪 Running Test 3');
    const links = page.locator('#content ul li a');
    expect(await links.count()).toBeGreaterThan(0);
  });
});

test.describe('Nested Hooks', () => {
  /**
   * 📚 NESTED HOOKS EXECUTION ORDER:
   *
   * Outer beforeAll
   * ├── Outer beforeEach
   * │   ├── Inner beforeEach
   * │   │   ├── test
   * │   │   └── Inner afterEach
   * │   └── Outer afterEach
   * └── Outer afterAll
   */

  test.beforeAll(async () => {
    console.log('\n🔧 OUTER beforeAll');
  });

  test.beforeEach(async ({ page }) => {
    console.log('🔧 OUTER beforeEach');
    await page.goto('/');
  });

  test.afterEach(async () => {
    console.log('🧹 OUTER afterEach');
  });

  test.afterAll(async () => {
    console.log('🧹 OUTER afterAll');
  });

  test('outer test', async ({ page }) => {
    console.log('   🧪 Outer test running');
    await expect(page).toHaveTitle('The Internet');
  });

  test.describe('Inner Suite', () => {
    test.beforeEach(async ({ page }) => {
      console.log('  🔧 INNER beforeEach');
      // Navigate to a specific page for inner tests
      await page.goto('/login');
    });

    test.afterEach(async () => {
      console.log('  🧹 INNER afterEach');
    });

    test('inner test', async ({ page }) => {
      console.log('     🧪 Inner test running');
      await expect(page).toHaveURL(/\/login/);
    });
  });
});

test.describe('Practical Hook Patterns', () => {

  test.describe('Login Setup Hook Pattern', () => {
    test.beforeEach(async ({ page }) => {
      // Common login setup for all tests in this suite
      await page.goto('/login');
      await page.locator('#username').fill('tomsmith');
      await page.locator('#password').fill('SuperSecretPassword!');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page).toHaveURL(/\/secure/);
    });

    test('should see secure area', async ({ page }) => {
      await expect(page.locator('h2')).toContainText('Secure Area');
    });

    test('should have logout button', async ({ page }) => {
      await expect(page.getByRole('link', { name: /Logout/i })).toBeVisible();
    });
  });

  test.describe('Hooks with test.step()', () => {
    test('should use test.step for logical grouping', async ({ page }) => {
      /**
       * 📚 test.step()
       * Groups actions into named steps.
       * Steps appear in the test report and trace viewer.
       * Great for documenting test flow.
       */
      await test.step('Navigate to login page', async () => {
        await page.goto('/login');
        await expect(page.locator('h2')).toHaveText('Login Page');
      });

      await test.step('Enter credentials', async () => {
        await page.locator('#username').fill('tomsmith');
        await page.locator('#password').fill('SuperSecretPassword!');
      });

      await test.step('Submit login form', async () => {
        await page.getByRole('button', { name: 'Login' }).click();
      });

      await test.step('Verify successful login', async () => {
        await expect(page).toHaveURL(/\/secure/);
        await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
      });
    });
  });
});
