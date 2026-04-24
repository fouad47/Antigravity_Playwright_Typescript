/**
 * ============================================================
 * CHAPTER 11: WAITS AND RETRIES
 * ============================================================
 *
 * 📚 WAIT HIERARCHY (Best → Worst):
 * 1. Auto-retrying assertions (expect().toBeVisible())
 * 2. Locator auto-waiting (click(), fill() auto-wait)
 * 3. locator.waitFor() (explicit element state wait)
 * 4. page.waitForURL() / page.waitForResponse()
 * 5. Custom polling wait (waitForCondition)
 * 6. page.waitForTimeout() ❌ AVOID
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('Explicit Wait Strategies', () => {

  test('should wait for element state with waitFor()', async ({ page }) => {
    await page.goto('/dynamic_loading/2');

    await page.locator('#start button').click();

    /**
     * 📚 locator.waitFor({ state })
     * States: 'visible', 'hidden', 'attached', 'detached'
     */
    // Wait for loading to finish
    await page.locator('#loading').waitFor({ state: 'visible' });
    console.log('⏳ Loading started...');

    await page.locator('#loading').waitFor({ state: 'hidden', timeout: 15000 });
    console.log('✅ Loading finished!');

    // Now verify the result
    await expect(page.locator('#finish h4')).toHaveText('Hello World!');
  });

  test('should wait for network response', async ({ page }) => {
    /**
     * 📚 page.waitForResponse()
     * Wait for a specific network response before continuing.
     * Useful when UI updates depend on API calls.
     */
    const responsePromise = page.waitForResponse((response) =>
      response.url().includes('the-internet') && response.status() === 200
    );

    await page.goto('/');
    const response = await responsePromise;
    console.log(`Response status: ${response.status()}`);
    expect(response.status()).toBe(200);
  });

  test('should wait for network idle state', async ({ page }) => {
    /**
     * 📚 page.waitForLoadState()
     * States:
     * - 'load': window load event fired
     * - 'domcontentloaded': DOM fully parsed
     * - 'networkidle': No network requests for 500ms
     */
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    console.log('✅ Network is idle');

    await expect(page).toHaveTitle('The Internet');
  });
});

test.describe('Retry Patterns', () => {

  test('should use custom retry logic for flaky operations', async ({ page }) => {
    await page.goto('/notification_message_rendered');

    /**
     * 📚 Custom Retry Pattern
     * Sometimes you need to retry an entire action sequence
     * (not just a wait). This pattern is useful for:
     * - Randomly generated content
     * - Flaky third-party services
     * - Race conditions in the UI
     */
    let desiredMessage = false;
    const maxRetries = 5;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      await page.getByRole('link', { name: 'Click here' }).click();
      
      const message = await page.locator('#flash').textContent();
      console.log(`Attempt ${attempt + 1}: "${message?.trim()}"`);

      if (message?.includes('Action successful') || message?.includes('unsuccesful')) {
        desiredMessage = true;
        break;
      }
    }

    expect(desiredMessage).toBeTruthy();
  });

  test('should use expect with custom timeout', async ({ page }) => {
    await page.goto('/dynamic_loading/1');
    await page.locator('#start button').click();

    /**
     * 📚 Assertion Timeout Override
     * Each auto-retrying assertion can have its own timeout.
     * This is better than a global timeout change.
     */
    await expect(page.locator('#finish h4')).toBeVisible({
      timeout: 20000, // 20 seconds for this specific check
    });
  });

  test('should use expect.poll() for custom polling', async ({ page }) => {
    await page.goto('/add_remove_elements/');

    // Add some elements
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Add Element' }).click();
    }

    /**
     * 📚 expect.poll()
     * Custom polling assertion that retries a function
     * until the assertion passes or times out.
     *
     * Use when: You need to poll a non-locator value.
     */
    await expect.poll(async () => {
      return page.locator('.added-manually').count();
    }, {
      message: 'waiting for 3 delete buttons',
      timeout: 5000,
    }).toBe(3);
  });

  test('should use expect.toPass() for retrying block', async ({ page }) => {
    await page.goto('/notification_message_rendered');

    /**
     * 📚 expect.toPass()
     * Retries an entire assertion block until it passes.
     * Perfect for scenarios where the action AND assertion
     * both need to be retried together.
     */
    await expect(async () => {
      await page.getByRole('link', { name: 'Click here' }).click();
      const text = await page.locator('#flash').textContent();
      expect(text?.trim()).toBeTruthy();
    }).toPass({
      intervals: [1000, 2000, 3000],
      timeout: 15000,
    });
  });
});

test.describe('Wait for Multiple Conditions', () => {

  test('should wait for multiple elements simultaneously', async ({ page }) => {
    await page.goto('/login');

    /**
     * 📚 Promise.all for Parallel Waits
     * Wait for multiple conditions at the same time.
     * Faster than waiting for each one sequentially.
     */
    await Promise.all([
      expect(page.locator('#username')).toBeVisible(),
      expect(page.locator('#password')).toBeVisible(),
      expect(page.getByRole('button', { name: 'Login' })).toBeVisible(),
    ]);

    console.log('✅ All login form elements are ready');
  });
});
