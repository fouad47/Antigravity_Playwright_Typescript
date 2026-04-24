/**
 * ============================================================
 * CHAPTER 13: CUSTOM FIXTURES
 * ============================================================
 *
 * 📚 WHAT ARE FIXTURES?
 * Fixtures are Playwright's dependency injection system.
 * They replace beforeEach/afterEach for providing resources.
 *
 * WHY FIXTURES OVER HOOKS?
 * 1. Lazy initialization: Only created when used
 * 2. Composable: Build complex setups from simple parts
 * 3. Type-safe: Full TypeScript IntelliSense
 * 4. Isolated: Each test gets its own fixture instances
 * 5. Reusable: Share across test files
 * ============================================================
 */

import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { CheckboxesPage } from '../../src/pages/CheckboxesPage';
import { TestDataGenerator } from '../../src/utils/TestDataGenerator';

// ============================================================
// CUSTOM FIXTURE DEFINITIONS
// ============================================================

/**
 * 📚 Step 1: Define fixture types
 * This interface tells TypeScript what fixtures are available.
 */
type MyFixtures = {
  loginPage: LoginPage;
  checkboxesPage: CheckboxesPage;
  testUser: { username: string; password: string };
  loggedInPage: Page;
};

/**
 * 📚 Step 2: Extend the base test with custom fixtures
 *
 * Each fixture is an async function that:
 * 1. Receives existing fixtures as the first parameter
 * 2. Receives a 'use' callback as the second parameter
 * 3. Sets up the resource
 * 4. Calls use(resource) to provide it to the test
 * 5. Cleans up after use() returns (teardown)
 */
const test = base.extend<MyFixtures>({
  /**
   * LoginPage fixture - provides a ready-to-use LoginPage instance.
   *
   * 📚 LEARNING NOTE:
   * This fixture depends on the built-in 'page' fixture.
   * Playwright handles the dependency chain automatically.
   */
  loginPage: async ({ page }, use) => {
    // Setup: Create the page object
    const loginPage = new LoginPage(page);
    console.log('🔧 Fixture: LoginPage created');

    // Provide to test
    await use(loginPage);

    // Teardown (runs after test)
    console.log('🧹 Fixture: LoginPage cleaned up');
  },

  checkboxesPage: async ({ page }, use) => {
    const checkboxesPage = new CheckboxesPage(page);
    await use(checkboxesPage);
  },

  /**
   * Test User fixture - provides random test credentials.
   *
   * 📚 LEARNING NOTE:
   * Fixtures don't have to depend on 'page'.
   * They can provide any type of data or resource.
   */
  testUser: async ({}, use) => {
    const user = {
      username: TestDataGenerator.generateRandomString(8),
      password: TestDataGenerator.generateRandomString(12),
    };
    console.log(`🔧 Fixture: Test user created - ${user.username}`);
    await use(user);
  },

  /**
   * Logged-in Page fixture - provides a page already logged in.
   *
   * 📚 LEARNING NOTE:
   * This fixture depends on 'page' and performs login in setup.
   * Tests using this fixture start already authenticated.
   */
  loggedInPage: async ({ page }, use) => {
    // Setup: Navigate and log in
    await page.goto('/login');
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/secure/);
    console.log('🔧 Fixture: User logged in');

    // Provide the authenticated page
    await use(page);

    // Teardown: Log out
    console.log('🧹 Fixture: Logging out...');
  },
});

// ============================================================
// TESTS USING CUSTOM FIXTURES
// ============================================================

test.describe('Using Custom Fixtures', () => {

  test('should use LoginPage fixture', async ({ loginPage }) => {
    /**
     * 📚 USING FIXTURES
     * Just destructure the fixture name from the test's first argument.
     * Playwright automatically:
     * 1. Creates the fixture
     * 2. Passes it to the test
     * 3. Cleans it up after
     */
    await loginPage.navigateTo();
    await loginPage.assertPageLoaded();
  });

  test('should use loginPage for login', async ({ loginPage }) => {
    await loginPage.navigateTo();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    await loginPage.assertLoginSuccess();
  });

  test('should use checkboxes fixture', async ({ checkboxesPage }) => {
    await checkboxesPage.navigateTo();
    await checkboxesPage.assertPageLoaded();
    await checkboxesPage.checkCheckbox(0);
    await checkboxesPage.assertCheckboxChecked(0);
  });

  test('should use testUser fixture', async ({ testUser }) => {
    console.log(`Using test user: ${testUser.username}`);
    expect(testUser.username).toBeTruthy();
    expect(testUser.password).toBeTruthy();
  });

  test('should use loggedInPage fixture', async ({ loggedInPage }) => {
    /**
     * 📚 FIXTURE COMPOSITION
     * The loggedInPage fixture handles login automatically.
     * The test starts on a page that is already authenticated!
     */
    await expect(loggedInPage.locator('h2')).toContainText('Secure Area');
    await expect(loggedInPage.getByRole('link', { name: /Logout/i })).toBeVisible();
  });

  test('should use multiple fixtures together', async ({ loginPage, testUser }) => {
    console.log(`Test user: ${testUser.username}`);
    await loginPage.navigateTo();
    await loginPage.assertPageLoaded();
    // Try login with random credentials (will fail - demonstrating the pattern)
    await loginPage.login(testUser.username, testUser.password);
    await loginPage.assertLoginFailure();
  });
});
