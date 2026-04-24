/**
 * ============================================================
 * CHAPTER 18: REPORTING & LOGGING
 * ============================================================
 *
 * 📚 PLAYWRIGHT REPORTERS:
 * - list: Console output (default)
 * - html: Interactive HTML report
 * - json: Machine-readable JSON
 * - junit: CI/CD integration
 * - dot: Minimal dot output
 * - line: Single line per test
 * - blob: For sharded test merging
 *
 * ARTIFACTS (configured in playwright.config.ts):
 * - Screenshots (on failure or always)
 * - Videos (on failure or always)
 * - Traces (DOM snapshots + network logs)
 * ============================================================
 */

import { test, expect } from '@playwright/test';
import { Logger } from '../../src/utils/Logger';
import { ScreenshotHelper } from '../../src/utils/ScreenshotHelper';

test.describe('Structured Test Logging', () => {

  test('should use test.step for structured logging', async ({ page }) => {
    /**
     * 📚 test.step()
     * Creates named steps that appear in:
     * - HTML report
     * - Trace viewer
     * - Console output
     *
     * Steps can return values and be nested.
     */
    const title = await test.step('Navigate to login page', async () => {
      await page.goto('/login');
      return page.title();
    });

    console.log(`Page title: ${title}`);

    await test.step('Fill in credentials', async () => {
      await page.locator('#username').fill('tomsmith');
      await page.locator('#password').fill('SuperSecretPassword!');
    });

    await test.step('Submit login form', async () => {
      await page.getByRole('button', { name: 'Login' }).click();
    });

    await test.step('Verify login success', async () => {
      await expect(page).toHaveURL(/\/secure/);
      await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
    });
  });

  test('should use Logger utility for detailed logging', async ({ page }) => {
    const logger = Logger.getInstance();

    logger.testStart('Login Flow Test');

    logger.step(1, 'Navigate to login page');
    await page.goto('/login');

    logger.step(2, 'Enter credentials');
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');

    logger.step(3, 'Click Login');
    await page.getByRole('button', { name: 'Login' }).click();

    logger.step(4, 'Verify success');
    await expect(page).toHaveURL(/\/secure/);

    logger.testEnd('Login Flow Test', true);
    logger.flush();
  });
});

test.describe('Artifact Capture', () => {

  test('should attach screenshots to report', async ({ page }, testInfo) => {
    await page.goto('/');

    /**
     * 📚 testInfo.attach()
     * Attach files to the test report.
     * These appear in the HTML report for each test.
     *
     * Content types: image/png, text/plain, application/json, etc.
     */
    // Full page screenshot
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('homepage-screenshot', {
      body: screenshot,
      contentType: 'image/png',
    });

    // Attach test metadata
    await testInfo.attach('test-metadata', {
      body: JSON.stringify({
        url: page.url(),
        title: await page.title(),
        viewport: page.viewportSize(),
        timestamp: new Date().toISOString(),
      }, null, 2),
      contentType: 'application/json',
    });

    await expect(page).toHaveTitle('The Internet');
  });

  test('should capture screenshots on pass and fail', async ({ page }, testInfo) => {
    await page.goto('/login');
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();

    /**
     * 📚 Screenshot on Every Test Outcome
     * Capture screenshots regardless of pass/fail.
     */
    const screenshotHelper = new ScreenshotHelper(page);
    await screenshotHelper.captureAlways(testInfo, 'login-result');

    await expect(page).toHaveURL(/\/secure/);
  });

  test('should demonstrate trace viewing', async ({ page }) => {
    /**
     * 📚 TRACE VIEWER
     *
     * Trace is configured in playwright.config.ts:
     * trace: 'retain-on-failure' or 'on'
     *
     * View traces with:
     *   npx playwright show-trace test-results/trace.zip
     *
     * Trace captures:
     * - DOM snapshots at each step
     * - Network requests/responses
     * - Console logs
     * - Screenshots at each step
     * - Source code for each action
     */
    await page.goto('/login');
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/secure/);

    console.log('💡 Run with trace enabled to see the trace viewer:');
    console.log('   npx playwright test --trace on');
    console.log('   npx playwright show-trace test-results/.../trace.zip');
  });
});

test.describe('Video Recording', () => {

  test('should demonstrate video recording', async ({ page }) => {
    /**
     * 📚 VIDEO RECORDING
     *
     * Configured in playwright.config.ts:
     * video: 'on' | 'off' | 'retain-on-failure' | 'on-first-retry'
     *
     * Videos are saved to the test results directory.
     *
     * 💡 'retain-on-failure' is recommended:
     * - Saves disk space (only keeps failure videos)
     * - Available for debugging when needed
     */
    await page.goto('/');
    await expect(page).toHaveTitle('The Internet');

    // Navigate through multiple pages (video will capture all)
    await page.getByRole('link', { name: 'Checkboxes' }).click();
    await page.locator('#checkboxes input').first().check();
    await page.goBack();

    await page.getByRole('link', { name: 'Dropdown' }).click();
    await page.locator('#dropdown').selectOption('1');

    console.log('💡 Enable video: set video: "on" in playwright.config.ts');
  });
});

test.describe('Console Log Capture', () => {

  test('should capture browser console logs', async ({ page }) => {
    /**
     * 📚 Browser Console Logs
     * Listen to console events for debugging.
     * Useful for catching JavaScript errors in the app.
     */
    const consoleLogs: string[] = [];

    page.on('console', (msg) => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    page.on('pageerror', (error) => {
      consoleLogs.push(`[PAGE ERROR] ${error.message}`);
    });

    await page.goto('/');
    await expect(page).toHaveTitle('The Internet');

    if (consoleLogs.length > 0) {
      console.log('\n📋 Browser Console Logs:');
      consoleLogs.forEach((log) => console.log(`  ${log}`));
    } else {
      console.log('No browser console messages captured');
    }
  });
});
