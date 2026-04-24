/**
 * ============================================================
 * CHAPTER 01: YOUR FIRST PLAYWRIGHT TEST
 * ============================================================
 *
 * 📚 LEARNING OBJECTIVES:
 * - Write your first Playwright test
 * - Use page.goto() to navigate
 * - Use expect() for assertions
 * - Understand test() function structure
 *
 * 🌐 APPLICATION UNDER TEST:
 * https://the-internet.herokuapp.com
 *
 * 💡 KEY CONCEPTS:
 * - test(): Defines a test case with a name and async function
 * - page: A Playwright Page object (represents a browser tab)
 * - expect(): Playwright's assertion library (auto-retrying!)
 * - page.goto(): Navigate to a URL
 * ============================================================
 */

import { test, expect } from '@playwright/test';

/**
 * 📚 TEST ANATOMY:
 *
 * test('Test Name', async ({ page }) => {
 *   // 1. ARRANGE: Set up test prerequisites
 *   // 2. ACT: Perform the action being tested
 *   // 3. ASSERT: Verify the expected outcome
 * });
 *
 * - 'Test Name': A descriptive name for the test
 * - async: Tests are asynchronous (we use await)
 * - { page }: Destructured fixture - Playwright gives us a fresh page
 */

// ============================================================
// TEST 1: Navigate to the home page
// ============================================================
test('should navigate to the-internet home page', async ({ page }) => {
  /**
   * 📚 page.goto()
   * Navigates the browser to a URL.
   * Uses baseURL from playwright.config.ts, so we only need the path.
   *
   * Full URL would be: https://the-internet.herokuapp.com/
   * With baseURL, we just use: '/'
   */
  await page.goto('/');

  /**
   * 📚 expect().toHaveTitle()
   * Asserts the page title matches the expected value.
   * This is an auto-retrying assertion - it will keep checking
   * until the title matches or the timeout expires.
   */
  await expect(page).toHaveTitle('The Internet');
});

// ============================================================
// TEST 2: Verify the home page heading
// ============================================================
test('should display the correct heading on home page', async ({ page }) => {
  // ARRANGE & ACT: Navigate to the page
  await page.goto('/');

  // ASSERT: Check the main heading
  /**
   * 📚 page.locator()
   * Creates a locator to find elements on the page.
   * Locators are lazy - they don't search for elements until used.
   *
   * Here we use a CSS selector 'h1.heading' to find the heading.
   */
  const heading = page.locator('h1.heading');
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText('Welcome to the-internet');
});

// ============================================================
// TEST 3: Verify page URL
// ============================================================
test('should have the correct URL', async ({ page }) => {
  await page.goto('/');

  /**
   * 📚 expect().toHaveURL()
   * Asserts the current page URL matches.
   * Can use string or RegExp patterns.
   */
  await expect(page).toHaveURL(/the-internet\.herokuapp\.com/);
});

// ============================================================
// TEST 4: Navigate to a subpage
// ============================================================
test('should navigate to the login page', async ({ page }) => {
  // Navigate directly to the login page
  await page.goto('/login');

  // Verify we're on the login page
  await expect(page).toHaveURL(/\/login/);

  // Verify the login form is visible
  const loginForm = page.locator('#login');
  await expect(loginForm).toBeVisible();
});

// ============================================================
// TEST 5: Check for links on the home page
// ============================================================
test('should display available examples on home page', async ({ page }) => {
  await page.goto('/');

  /**
   * 📚 locator.count()
   * Returns the number of elements matching the locator.
   *
   * 📚 expect().toBeGreaterThan()
   * Built-in matcher for numeric comparisons.
   */
  const exampleLinks = page.locator('#content ul li a');
  const linkCount = await exampleLinks.count();

  // The home page has many example links
  expect(linkCount).toBeGreaterThan(10);

  console.log(`Found ${linkCount} example links on the home page`);
});

// ============================================================
// TEST 6: Verify page content includes specific text
// ============================================================
test('should find specific examples listed on home page', async ({ page }) => {
  await page.goto('/');

  /**
   * 📚 page.getByRole() and page.getByText()
   * Preferred locator strategies - more accessible and resilient.
   * getByRole: Find by ARIA role (link, button, heading, etc.)
   * getByText: Find by visible text content
   */
  // Check for specific example links
  await expect(page.getByRole('link', { name: 'Form Authentication' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Checkboxes' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Dropdown' })).toBeVisible();
});
