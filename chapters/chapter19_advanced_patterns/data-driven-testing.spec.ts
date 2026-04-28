/**
 * ============================================================
 * CHAPTER 19: DATA-DRIVEN TESTING
 * ============================================================
 *
 * 📚 Data-Driven Testing runs the same test logic
 * with multiple sets of input data. This maximizes
 * test coverage with minimal code.
 *
 * PLAYWRIGHT PATTERNS:
 * 1. Array + forEach: Simple loop-based parameterization
 * 2. test.describe.parallel: Run variants in parallel
 * 3. JSON data files: External data sources
 * 4. Faker: Random data generation
 * ============================================================
 */

import { test, expect } from '@playwright/test';
import { TestDataGenerator } from '../../src/utils/TestDataGenerator';
import { INVALID_CREDENTIALS, KEY_PRESS_DATA } from '../../test-data/testData';

test.describe('Data-Driven Login Tests', () => {

  /**
   * 📚 Pattern 1: Array-Based Parameterization
   * Define test data as an array of objects.
   * Loop through and create a test for each dataset.
   */
  const loginTestData = [
    {
      name: 'valid credentials',
      username: 'tomsmith',
      password: 'SuperSecretPassword!',
      shouldSucceed: true,
      expectedMessage: 'You logged into a secure area!',
    },
    {
      name: 'invalid username',
      username: 'wronguser',
      password: 'SuperSecretPassword!',
      shouldSucceed: false,
      expectedMessage: 'Your username is invalid!',
    },
    {
      name: 'invalid password',
      username: 'tomsmith',
      password: 'wrongpassword',
      shouldSucceed: false,
      expectedMessage: 'Your password is invalid!',
    },
    {
      name: 'empty credentials',
      username: '',
      password: '',
      shouldSucceed: false,
      expectedMessage: 'Your username is invalid!',
    },
  ];

  for (const data of loginTestData) {
    test(`should handle login with ${data.name}`, async ({ page }) => {
      await page.goto('/login');
      await page.locator('#username').fill(data.username);
      await page.locator('#password').fill(data.password);
      await page.getByRole('button', { name: 'Login' }).click();

      await expect(page.locator('#flash')).toContainText(data.expectedMessage);

      if (data.shouldSucceed) {
        await expect(page).toHaveURL(/\/secure/);
      }
    });
  }
});

test.describe('Parameterized Key Press Tests', () => {

  /**
   * 📚 Pattern 2: Using imported test data
   */
  for (const keyData of KEY_PRESS_DATA) {
    test(`should detect key press: ${keyData.key}`, async ({ page }) => {
      await page.goto('/key_presses');
      const input = page.locator('#target');
      await input.click({ force: true });
      await page.keyboard.press(keyData.key);
      await expect(page.locator('#result')).toContainText(keyData.expectedResult, { timeout: 10000 });
    });
  }
});

test.describe('Data-Driven Navigation Tests', () => {

  const pages = [
    { name: 'Checkboxes', url: '/checkboxes', heading: 'Checkboxes' },
    { name: 'Dropdown', url: '/dropdown', heading: 'Dropdown List' },
    { name: 'Form Authentication', url: '/login', heading: 'Login Page' },
    { name: 'Key Presses', url: '/key_presses', heading: 'Key Presses' },
    { name: 'Add/Remove Elements', url: '/add_remove_elements/', heading: 'Add/Remove Elements' },
  ];

  for (const pageData of pages) {
    test(`should navigate to ${pageData.name} page`, async ({ page }) => {
      await page.goto(pageData.url);
      await expect(page.locator('h2, h3').first()).toContainText(pageData.heading);
    });
  }
});

test.describe('Random Data Testing with Faker', () => {

  test('should generate random test users for login attempts', async ({ page }) => {
    /**
     * 📚 Pattern 3: Faker-Generated Data
     * Use random data to test edge cases.
     */
    const users = TestDataGenerator.generateUsers(3);

    for (const user of users) {
      await page.goto('/login');
      await page.locator('#username').fill(user.username);
      await page.locator('#password').fill(user.password);
      await page.getByRole('button', { name: 'Login' }).click();

      // Random credentials should fail login
      await expect(page.locator('#flash')).toContainText('Your username is invalid!');
      console.log(`Tested with random user: ${user.username}`);
    }
  });
});

test.describe('JSON File Data Source', () => {

  test('should use JSON data for login tests', async ({ page }) => {
    /**
     * 📚 Pattern 4: External JSON Data
     * Load test data from JSON files.
     */
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const userData = require('../../test-data/users.json');

    // Test valid user
    await page.goto('/login');
    await page.locator('#username').fill(userData.validUser.username);
    await page.locator('#password').fill(userData.validUser.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');

    // Test invalid users from JSON
    for (const invalidUser of userData.invalidUsers) {
      await page.goto('/login');
      await page.locator('#username').fill(invalidUser.username);
      await page.locator('#password').fill(invalidUser.password);
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page.locator('#flash')).toContainText(invalidUser.expectedError);
    }
  });
});
