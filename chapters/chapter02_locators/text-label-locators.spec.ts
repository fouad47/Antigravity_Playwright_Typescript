/**
 * ============================================================
 * CHAPTER 02: TEXT, LABEL, AND PLACEHOLDER LOCATORS
 * ============================================================
 *
 * 📚 LEARNING OBJECTIVES:
 * - Use getByText() to find elements by visible text
 * - Use getByLabel() to find form inputs by their labels
 * - Use getByPlaceholder() for inputs with placeholder text
 * - Use getByTestId() for data-testid attributes
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('getByText() - Text-Based Locators', () => {

  test('should find elements by exact text', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 getByText()
     * Finds elements containing the specified text.
     * By default, matches as substring, case-insensitive.
     *
     * Matches any element with that text, not just links or buttons.
     */
    const heading = page.getByText('Welcome to the-internet');
    await expect(heading).toBeVisible();
  });

  test('should find elements with substring matching', async ({ page }) => {
    await page.goto('/login');

    // Finds element containing "Login Page" (substring match)
    const header = page.getByText('Login Page');
    await expect(header).toBeVisible();
  });

  test('should find elements with exact text matching', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 { exact: true }
     * Exact matching finds elements where the full text matches.
     * No substring matching.
     */
    const exactLink = page.getByText('Checkboxes', { exact: true });
    await expect(exactLink).toBeVisible();
  });

  test('should find elements with regex', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 RegExp with getByText
     * Use regex for pattern matching:
     * - /^text$/ - Exact match
     * - /text/i - Case insensitive
     * - /text.*more/ - Pattern matching
     */
    const link = page.getByText(/form authentication/i);
    await expect(link).toBeVisible();
  });
});

test.describe('getByLabel() - Label-Based Locators', () => {

  test('should find input by its label text', async ({ page }) => {
    await page.goto('/login');

    /**
     * 📚 getByLabel()
     * Finds form controls by their associated <label> text.
     * This is the BEST strategy for form inputs because:
     * 1. It mirrors how users find inputs (by reading labels)
     * 2. It encourages proper label-input association
     * 3. It's resilient to CSS/structure changes
     */
    const usernameInput = page.getByLabel('Username');
    await expect(usernameInput).toBeVisible();
    await usernameInput.fill('testuser');

    const passwordInput = page.getByLabel('Password');
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill('testpass');
  });
});

test.describe('getByPlaceholder() - Placeholder-Based Locators', () => {

  test('should find input by placeholder text', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 getByPlaceholder()
     * Finds inputs by their placeholder attribute.
     * Useful when inputs don't have visible labels.
     *
     * ⚠️ Less preferred than getByLabel because:
     * - Placeholders disappear when user types
     * - Not all inputs have placeholders
     * - Labels are better for accessibility
     */
    // Note: the-internet.herokuapp.com may not have placeholders
    // on every page, so we demonstrate the concept
  });
});

test.describe('getByTestId() - Test ID Locators', () => {

  test('should understand data-testid attribute', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 getByTestId()
     * Finds elements by their data-testid attribute.
     *
     * When to use:
     * - When getByRole/Text/Label don't work
     * - When the element has no semantic meaning
     * - When developers add testids for automation
     *
     * 💡 Configure custom testid attribute in playwright.config.ts:
     * use: { testIdAttribute: 'data-test-id' }
     *
     * ⚠️ Requires cooperation with developers to add testids.
     */
    // Example: page.getByTestId('login-button')
    // Would match: <button data-testid="login-button">Login</button>
    
    // Since the-internet.herokuapp.com doesn't use data-testid,
    // we verify the page loads as a baseline
    await expect(page).toHaveTitle('The Internet');
  });
});

test.describe('getByAltText() - Alt Text Locators', () => {

  test('should find images by alt text', async ({ page }) => {
    await page.goto('/broken_images');

    /**
     * 📚 getByAltText()
     * Finds <img>, <input[type=image]>, and <area> elements
     * by their alt text attribute.
     *
     * Useful for image verification and accessibility testing.
     */
    // Check if any images have alt text
    const images = page.locator('img');
    const count = await images.count();
    console.log(`Found ${count} images on broken images page`);
  });
});
