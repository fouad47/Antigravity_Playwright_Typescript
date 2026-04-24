/**
 * ============================================================
 * CHAPTER 05: AUTO-WAITING AND ACTIONABILITY
 * ============================================================
 *
 * 📚 LEARNING OBJECTIVES:
 * - Understand how Playwright auto-waits before actions
 * - Learn the actionability checks for each action type
 * - Know when auto-waiting is sufficient
 * - Understand when explicit waits are needed
 *
 * 💡 KEY CONCEPT:
 * Playwright AUTOMATICALLY waits for elements before interacting.
 * This eliminates most timing issues that plague other tools.
 *
 * ACTIONABILITY CHECKS (before click()):
 * ✅ Element is attached to the DOM
 * ✅ Element is visible
 * ✅ Element is stable (not animating)
 * ✅ Element receives events (not covered by another element)
 * ✅ Element is enabled
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('Auto-Waiting in Action', () => {

  test('should auto-wait for element to appear (Dynamic Loading Example 1)', async ({ page }) => {
    await page.goto('/dynamic_loading/1');

    /**
     * 📚 SCENARIO: Hidden element made visible
     *
     * In Dynamic Loading Example 1:
     * - The "Hello World!" text is in the DOM but hidden
     * - Clicking "Start" begins a loading animation
     * - After loading, the text becomes visible
     *
     * Playwright's auto-wait handles this automatically!
     */

    // Click Start button (auto-waits for it to be clickable)
    await page.locator('#start button').click();

    /**
     * 📚 expect().toBeVisible()
     * This assertion AUTO-RETRIES until the element is visible
     * or the timeout expires. No explicit wait needed!
     *
     * Default assertion timeout: 5 seconds (from config)
     * Override per assertion: expect(x).toBeVisible({ timeout: 10000 })
     */
    await expect(page.locator('#finish h4')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#finish h4')).toHaveText('Hello World!');
  });

  test('should auto-wait for element to be rendered (Dynamic Loading Example 2)', async ({ page }) => {
    await page.goto('/dynamic_loading/2');

    /**
     * 📚 SCENARIO: Element not in DOM, added after loading
     *
     * In Dynamic Loading Example 2:
     * - The "Hello World!" text is NOT in the DOM initially
     * - After clicking "Start" and loading finishes,
     *   the element is CREATED and added to the DOM
     *
     * Playwright handles this too - it waits for the element
     * to appear in the DOM AND become visible.
     */
    await page.locator('#start button').click();

    // Auto-retrying assertion - waits for element to exist and have text
    await expect(page.locator('#finish h4')).toHaveText('Hello World!', {
      timeout: 15000,
    });
  });

  test('should auto-wait for dynamic controls', async ({ page }) => {
    await page.goto('/dynamic_controls');

    /**
     * 📚 SCENARIO: Element being removed and added back
     *
     * The checkbox can be removed and re-added.
     * Playwright's assertions auto-retry to handle the transition.
     */
    const checkbox = page.locator('#checkbox input');
    const removeButton = page.locator('#checkbox-example button');

    // Verify checkbox is initially visible
    await expect(checkbox).toBeVisible();

    // Click Remove
    await removeButton.click();

    // Auto-retrying assertion waits for checkbox to disappear
    await expect(checkbox).not.toBeVisible({ timeout: 15000 });
    await expect(page.locator('#message')).toHaveText("It's gone!");
  });

  test('should auto-wait for input to become enabled', async ({ page }) => {
    await page.goto('/dynamic_controls');

    const textInput = page.locator('#input-example input');
    const enableButton = page.locator('#input-example button');

    // Input starts disabled
    await expect(textInput).toBeDisabled();

    // Click Enable
    await enableButton.click();

    /**
     * 📚 Auto-Wait for Enabled State
     * Playwright's fill() auto-waits for the input to be enabled.
     * No need for explicit waitForEnabled!
     */
    await expect(textInput).toBeEnabled({ timeout: 15000 });

    // fill() will auto-wait for the input to be enabled
    await textInput.fill('Hello Playwright!');
    await expect(textInput).toHaveValue('Hello Playwright!');
  });
});

test.describe('Explicit Waits (When Auto-Wait Is Not Enough)', () => {

  test('should use waitFor() for specific element states', async ({ page }) => {
    await page.goto('/dynamic_loading/1');

    /**
     * 📚 locator.waitFor()
     * Explicitly wait for a specific element state:
     * - 'visible': Element is visible
     * - 'hidden': Element is hidden or removed
     * - 'attached': Element is in the DOM (even if hidden)
     * - 'detached': Element is removed from the DOM
     *
     * 💡 Use when you need to wait for a state change
     * BEFORE performing an action (not just for assertions).
     */
    await page.locator('#start button').click();

    // Explicitly wait for loading to finish
    await page.locator('#loading').waitFor({ state: 'hidden', timeout: 15000 });

    // Now the element should be visible
    const text = await page.locator('#finish h4').textContent();
    expect(text).toBe('Hello World!');
  });

  test('should use waitForURL() for navigation', async ({ page }) => {
    await page.goto('/login');

    /**
     * 📚 page.waitForURL()
     * Wait for the page URL to change.
     * Useful after form submissions or redirects.
     */
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for redirect
    await page.waitForURL('**/secure');
    expect(page.url()).toContain('/secure');
  });

  test('should use waitForResponse() for API calls', async ({ page }) => {
    /**
     * 📚 page.waitForResponse()
     * Wait for a specific network response.
     * Useful when the UI depends on an API call completing.
     */
    // Navigate and wait for the page response
    const response = await page.goto('/')!;
    expect(response?.status()).toBe(200);
  });
});

test.describe('Anti-Patterns to Avoid', () => {

  test('should NOT use waitForTimeout (hard waits)', async ({ page }) => {
    await page.goto('/');

    /**
     * ⚠️ ANTI-PATTERN: page.waitForTimeout()
     *
     * NEVER use hard waits in production tests!
     * Problems:
     * 1. Makes tests SLOW (always waits the full duration)
     * 2. Makes tests FLAKY (may not wait long enough)
     * 3. Hides real timing issues
     *
     * ❌ DON'T: await page.waitForTimeout(5000);
     * ✅ DO:   await expect(element).toBeVisible();
     *
     * The ONLY acceptable use is in debugging.
     */

    // ✅ CORRECT: Auto-retrying assertion
    await expect(page.locator('h1')).toBeVisible();

    // ✅ CORRECT: Wait for specific condition
    await expect(page).toHaveTitle('The Internet');
  });
});
