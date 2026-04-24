/**
 * ============================================================
 * CHAPTER 01: CONFIGURATION DEMO
 * ============================================================
 *
 * 📚 LEARNING OBJECTIVES:
 * - Understand how playwright.config.ts settings affect tests
 * - Override global settings per test
 * - Work with timeouts
 * - Use test.use() for test-level configuration
 * ============================================================
 */

import { test, expect } from '@playwright/test';

/**
 * 📚 test.use()
 * Override playwright.config.ts settings for a specific describe block.
 * Useful when certain tests need different settings.
 */
test.describe('Configuration Overrides', () => {
  // Override viewport for this test suite
  test.use({
    viewport: { width: 1280, height: 720 },
  });

  test('should work with custom viewport size', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 page.viewportSize()
     * Returns the current viewport dimensions.
     * Useful for responsive design testing.
     */
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(1280);
    expect(viewport?.height).toBe(720);
    console.log(`Viewport: ${viewport?.width}x${viewport?.height}`);
  });
});

test.describe('Timeout Configuration', () => {
  test('should demonstrate test timeout', async ({ page }) => {
    /**
     * 📚 test.setTimeout()
     * Override the test timeout for this specific test.
     * Default is 30 seconds from playwright.config.ts.
     *
     * ⚠️ ANTI-PATTERN: Don't set very long timeouts to "fix" slow tests.
     * Instead, investigate why the test is slow.
     */
    test.setTimeout(15_000); // 15 seconds for this specific test

    await page.goto('/');
    await expect(page).toHaveTitle('The Internet');
  });
});

test.describe('Browser Information', () => {
  test('should display browser information', async ({ page, browserName }) => {
    /**
     * 📚 browserName fixture
     * Playwright provides the current browser name as a fixture.
     * Useful for browser-specific test logic.
     */
    await page.goto('/');

    console.log(`🌐 Browser: ${browserName}`);
    console.log(`📄 URL: ${page.url()}`);
    console.log(`📐 Viewport: ${JSON.stringify(page.viewportSize())}`);

    // All browsers should see the same page
    await expect(page).toHaveTitle('The Internet');
  });
});

test.describe('Test Info Demo', () => {
  test('should access test metadata', async ({ page }, testInfo) => {
    /**
     * 📚 testInfo
     * The second parameter of the test function provides metadata:
     * - testInfo.title: Test name
     * - testInfo.project.name: Browser/project name
     * - testInfo.retry: Current retry number (0 for first run)
     * - testInfo.timeout: Test timeout in ms
     *
     * 💡 Use testInfo for dynamic test behavior and reporting.
     */
    await page.goto('/');

    console.log(`📝 Test: ${testInfo.title}`);
    console.log(`📁 Project: ${testInfo.project.name}`);
    console.log(`🔄 Retry: ${testInfo.retry}`);
    console.log(`⏱️ Timeout: ${testInfo.timeout}ms`);

    // Attach information to the test report
    await testInfo.attach('test-info', {
      body: JSON.stringify({
        title: testInfo.title,
        project: testInfo.project.name,
        url: page.url(),
      }),
      contentType: 'application/json',
    });

    await expect(page).toHaveTitle('The Internet');
  });
});
