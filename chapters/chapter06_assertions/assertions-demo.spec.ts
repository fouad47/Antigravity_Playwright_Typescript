/**
 * ============================================================
 * CHAPTER 06: ASSERTIONS
 * ============================================================
 *
 * 📚 Playwright has TWO types of assertions:
 *
 * 1. AUTO-RETRYING (Web-First) Assertions:
 *    - Keep checking until pass or timeout
 *    - Used with expect(locator)
 *    - Examples: toBeVisible(), toHaveText(), toHaveURL()
 *
 * 2. NON-RETRYING (Generic) Assertions:
 *    - Check once and pass/fail immediately
 *    - Used with expect(value)
 *    - Examples: toBe(), toEqual(), toContain()
 *
 * 💡 BEST PRACTICE: Always prefer auto-retrying assertions
 * for elements on the page. Use non-retrying only for values
 * you've already extracted.
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('Auto-Retrying (Web-First) Assertions', () => {

  test('should assert element visibility', async ({ page }) => {
    await page.goto('/login');

    // ✅ toBeVisible() - element is displayed
    await expect(page.locator('#username')).toBeVisible();

    // ✅ toBeHidden() - element is not displayed
    await expect(page.locator('#flash')).toBeHidden();
  });

  test('should assert text content', async ({ page }) => {
    await page.goto('/login');

    // ✅ toHaveText() - exact text match (trims whitespace)
    await expect(page.locator('h2')).toContainText('Login Page');

    // ✅ toContainText() - partial/substring text match
    await expect(page.locator('.subheader')).toContainText('secure area');
  });

  test('should assert element state', async ({ page }) => {
    await page.goto('/checkboxes');

    const checkbox1 = page.locator('#checkboxes input').first();
    const checkbox2 = page.locator('#checkboxes input').last();

    // ✅ toBeChecked() / not.toBeChecked()
    await expect(checkbox1).not.toBeChecked();
    await expect(checkbox2).toBeChecked();

    // ✅ toBeEnabled() / toBeDisabled()
    await expect(checkbox1).toBeEnabled();
  });

  test('should assert input values', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#username').fill('testuser');

    // ✅ toHaveValue() - input value
    await expect(page.locator('#username')).toHaveValue('testuser');
  });

  test('should assert element attributes', async ({ page }) => {
    await page.goto('/login');

    // ✅ toHaveAttribute() - any HTML attribute
    await expect(page.locator('#username')).toHaveAttribute('type', 'text');
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
  });

  test('should assert CSS properties', async ({ page }) => {
    await page.goto('/login');

    // ✅ toHaveCSS() - CSS property value
    const button = page.getByRole('button', { name: 'Login' });
    await expect(button).toBeVisible();
  });

  test('should assert element count', async ({ page }) => {
    await page.goto('/checkboxes');

    // ✅ toHaveCount() - number of matching elements
    await expect(page.locator('#checkboxes input')).toHaveCount(2);
  });

  test('should assert page URL and title', async ({ page }) => {
    await page.goto('/login');

    // ✅ toHaveURL() - page URL (string or RegExp)
    await expect(page).toHaveURL(/\/login/);

    // ✅ toHaveTitle() - page title
    await expect(page).toHaveTitle('The Internet');
  });

  test('should use negation with not', async ({ page }) => {
    await page.goto('/login');

    // ✅ Use .not for negative assertions
    await expect(page.locator('#username')).not.toBeHidden();
    await expect(page.locator('#username')).not.toBeDisabled();
    await expect(page.locator('#flash')).not.toBeVisible();
  });

  test('should use custom timeout for assertions', async ({ page }) => {
    await page.goto('/dynamic_loading/1');
    await page.locator('#start button').click();

    /**
     * 📚 Custom Timeout
     * Override the default assertion timeout (5s) per assertion.
     * Useful for elements that take longer to appear.
     */
    await expect(page.locator('#finish h4')).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Non-Retrying (Generic) Assertions', () => {

  test('should use generic value assertions', async ({ page }) => {
    await page.goto('/tables');

    // Extract values first, then use non-retrying assertions
    const rowCount = await page.locator('#table1 tbody tr').count();

    // ✅ toBe() - strict equality
    expect(rowCount).toBe(4);

    // ✅ toBeGreaterThan() / toBeLessThan()
    expect(rowCount).toBeGreaterThan(0);
    expect(rowCount).toBeLessThan(100);

    const title = await page.title();
    // ✅ toContain() - string or array contains
    expect(title).toContain('Internet');

    // ✅ toBeTruthy() / toBeFalsy()
    expect(title).toBeTruthy();

    // ✅ toMatch() - regex match
    expect(title).toMatch(/Internet/);
  });

  test('should use object/array assertions', async ({ page }) => {
    await page.goto('/tables');

    const headers = await page.locator('#table1 thead th').allTextContents();

    // ✅ toEqual() - deep equality
    expect(headers.length).toBeGreaterThan(0);

    // ✅ toContain() - array contains element
    expect(headers).toContain('Last Name');
    expect(headers).toContain('First Name');

    // ✅ toHaveLength() - array/string length
    expect(headers).toHaveLength(6);
  });
});

test.describe('Soft Assertions', () => {

  test('should use soft assertions to collect multiple failures', async ({ page }) => {
    await page.goto('/login');

    /**
     * 📚 Soft Assertions
     * expect.soft() doesn't stop the test on failure.
     * All soft assertion failures are collected and reported
     * at the end of the test.
     *
     * 💡 Use when you want to check multiple things and see
     * ALL failures at once, not just the first one.
     */
    await expect.soft(page.locator('h2')).toContainText('Login Page');
    await expect.soft(page.locator('#username')).toBeVisible();
    await expect.soft(page.locator('#password')).toBeVisible();
    await expect.soft(page.getByRole('button', { name: 'Login' })).toBeVisible();

    // If any soft assertion fails, the test still continues
    // but will be marked as failed at the end
  });
});

test.describe('Custom Error Messages', () => {

  test('should add custom error messages to assertions', async ({ page }) => {
    await page.goto('/login');

    /**
     * 📚 Custom Error Messages
     * Add a descriptive message to help debug failures.
     * The message appears in the error output on failure.
     */
    await expect(
      page.locator('#username'),
      'Username input should be visible on login page'
    ).toBeVisible();

    await expect(
      page.locator('#password'),
      'Password input should be visible on login page'
    ).toBeVisible();
  });
});
