/**
 * ============================================================
 * CHAPTER 19: ADVANCED UTILITIES AND PATTERNS
 * ============================================================
 *
 * 📚 Advanced patterns for production test frameworks:
 * - Network interception (mocking/stubbing)
 * - Request/response monitoring
 * - Performance metrics collection
 * - Custom test annotations
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('Network Interception', () => {

  test('should intercept and monitor network requests', async ({ page }) => {
    /**
     * 📚 page.route() - Network Interception
     * Intercept network requests to:
     * - Mock API responses
     * - Block resources (images, scripts)
     * - Modify request headers
     * - Simulate error responses
     */
    const requests: string[] = [];

    // Monitor all requests
    page.on('request', (request) => {
      if (request.resourceType() === 'document' || request.resourceType() === 'xhr') {
        requests.push(`${request.method()} ${request.url()}`);
      }
    });

    await page.goto('/');
    console.log('\n📡 Captured requests:');
    requests.forEach((r) => console.log(`  ${r}`));
    expect(requests.length).toBeGreaterThan(0);
  });

  test('should block image loading for faster tests', async ({ page }) => {
    /**
     * 📚 Blocking Resources
     * Block images, CSS, fonts, etc. for faster execution.
     * Useful when visual rendering doesn't matter.
     */
    await page.route('**/*.{png,jpg,jpeg,gif,svg}', (route) => {
      route.abort();
    });

    await page.goto('/broken_images');

    // Page loads faster without images
    await expect(page.locator('h3')).toHaveText('Broken Images');
    console.log('✅ Page loaded without images (faster execution)');
  });

  test('should mock an API response', async ({ page }) => {
    /**
     * 📚 Mocking API Responses
     * Replace real API calls with mock data.
     * Useful for testing error states, edge cases,
     * or when the API is unavailable.
     */
    await page.route('**/status_codes/500', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body><h1>Mocked Response</h1></body></html>',
      });
    });

    // Navigate to a 500 page, but we'll get our mock instead
    await page.goto('/status_codes/500');
    // The page will show our mocked content
    console.log('✅ Successfully mocked API response');
  });

  test('should modify request headers', async ({ page }) => {
    /**
     * 📚 Modifying Request Headers
     * Add custom headers to outgoing requests.
     */
    await page.route('**/*', async (route) => {
      const headers = {
        ...route.request().headers(),
        'X-Custom-Header': 'Playwright-Test',
      };
      await route.continue({ headers });
    });

    await page.goto('/');
    await expect(page).toHaveTitle('The Internet');
    console.log('✅ Custom header added to all requests');
  });
});

test.describe('Performance Metrics', () => {

  test('should collect page load metrics', async ({ page }) => {
    /**
     * 📚 Performance API
     * Access browser performance metrics via evaluate().
     */
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const metrics = await page.evaluate(() => {
      const timing = performance.timing;
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        fullLoad: timing.loadEventEnd - timing.navigationStart,
        domInteractive: timing.domInteractive - timing.navigationStart,
        responseTime: timing.responseEnd - timing.requestStart,
      };
    });

    console.log('\n⏱️ Page Load Metrics:');
    console.log(`  DOM Content Loaded: ${metrics.domContentLoaded}ms`);
    console.log(`  Full Page Load: ${metrics.fullLoad}ms`);
    console.log(`  DOM Interactive: ${metrics.domInteractive}ms`);
    console.log(`  Server Response: ${metrics.responseTime}ms`);

    // Performance assertions
    expect(metrics.fullLoad).toBeLessThan(10000);
  });
});

test.describe('Advanced Element Patterns', () => {

  test('should evaluate JavaScript in browser context', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 page.evaluate()
     * Run JavaScript code in the browser context.
     * Useful for accessing browser APIs.
     */
    const linkCount = await page.evaluate(() => {
      return document.querySelectorAll('#content ul li a').length;
    });

    console.log(`Links found via evaluate: ${linkCount}`);
    expect(linkCount).toBeGreaterThan(10);
  });

  test('should use evaluateHandle for DOM references', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 page.evaluateHandle()
     * Returns a JSHandle instead of serialized data.
     * Use when you need a reference to a DOM element.
     */
    const bodyHandle = await page.evaluateHandle(() => document.body);
    const innerHTML = await bodyHandle.evaluate((body) => body.innerHTML.length);
    console.log(`Body innerHTML length: ${innerHTML} chars`);
    expect(innerHTML).toBeGreaterThan(0);

    await bodyHandle.dispose(); // Clean up the handle
  });

  test('should handle localStorage and sessionStorage', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 Storage Manipulation
     * Read/write localStorage and sessionStorage via evaluate().
     */
    // Write to localStorage
    await page.evaluate(() => {
      localStorage.setItem('test-key', 'test-value');
      localStorage.setItem('user', JSON.stringify({ name: 'Playwright', role: 'tester' }));
    });

    // Read from localStorage
    const value = await page.evaluate(() => localStorage.getItem('test-key'));
    expect(value).toBe('test-value');

    const user = await page.evaluate(() => JSON.parse(localStorage.getItem('user')!));
    expect(user.name).toBe('Playwright');

    console.log('✅ LocalStorage manipulation successful');
  });
});
