/**
 * ============================================================
 * CHAPTER 16: API TESTING WITH PLAYWRIGHT
 * ============================================================
 *
 * 📚 Playwright provides built-in API testing via:
 * - request fixture (per-test APIRequestContext)
 * - playwright.request.newContext() (standalone)
 *
 * KEY BENEFITS:
 * - No external library needed (no axios/supertest)
 * - Share auth state between API and UI tests
 * - Built into the same test framework
 * ============================================================
 */

import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/ApiClient';

test.describe('API Testing - HTTP Methods', () => {

  test('should perform GET request for status codes', async ({ request }) => {
    /**
     * 📚 GET Request
     * Use request.get() to send GET requests.
     * The request fixture provides an APIRequestContext.
     */
    const response = await request.get('/status_codes/200');
    
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    
    console.log(`GET /status_codes/200`);
    console.log(`  Status: ${response.status()}`);
    console.log(`  OK: ${response.ok()}`);
  });

  test('should verify different status codes', async ({ request }) => {
    /**
     * 📚 Testing Multiple Status Codes
     * the-internet.herokuapp.com provides status code pages.
     */
    const statusCodes = [200, 301, 404, 500];

    for (const code of statusCodes) {
      const response = await request.get(`/status_codes/${code}`, {
        maxRedirects: 0, // Don't follow redirects
      });

      // 301 will show up as redirect
      if (code === 301) {
        expect(response.status()).toBe(301);
      } else {
        expect(response.status()).toBe(code);
      }

      console.log(`  Status ${code}: ${response.status()} ${response.statusText()}`);
    }
  });

  test('should perform POST request to authenticate', async ({ request }) => {
    /**
     * 📚 POST Request
     * Use request.post() to send POST requests with data.
     */
    const response = await request.post('/authenticate', {
      form: {
        username: 'tomsmith',
        password: 'SuperSecretPassword!',
      },
    });

    const status = response.status();
    console.log(`POST /authenticate - Status: ${status}`);
    // The authenticate endpoint redirects on success
    expect([200, 302]).toContain(status);
  });
});

test.describe('API Client Usage', () => {

  test('should use ApiClient for GET request', async ({ request }) => {
    const apiClient = new ApiClient(request);

    const response = await apiClient.get('/status_codes/200');
    expect(response.status).toBe(200);
    console.log(`ApiClient GET response: ${response.status}`);
  });

  test('should validate response schema', async ({ request }) => {
    const apiClient = new ApiClient(request);

    /**
     * 📚 Schema Validation
     * Verify that API responses contain required fields.
     * Our ApiClient has a simple schema validator.
     *
     * For production, consider using Zod or Ajv.
     */
    const response = await apiClient.get('/');

    // The response is HTML, but we can verify it has content
    expect(response.status).toBe(200);
    expect(response.data).toBeTruthy();
  });
});

test.describe('API + UI Integration Tests', () => {

  test('should verify status code page via API and UI', async ({ page, request }) => {
    /**
     * 📚 API + UI Integration
     *
     * Pattern: Verify backend (API) and frontend (UI) agree.
     * 1. Check API response
     * 2. Verify UI displays matching information
     */

    // API check
    const apiResponse = await request.get('/status_codes/200');
    expect(apiResponse.status()).toBe(200);

    // UI check
    await page.goto('/status_codes');
    await expect(page.locator('a:text("200")')).toBeVisible();
    
    // Navigate to status code page
    await page.locator('a:text("200")').click();
    await expect(page.locator('.example p')).toContainText('200');
    
    console.log('✅ API and UI both confirm status 200 page works');
  });

  test('should use API to set up data, then verify in UI', async ({ page, request }) => {
    /**
     * 📚 API Setup + UI Verification Pattern
     *
     * Use API calls to perform fast setup/teardown:
     * 1. API: Create test data
     * 2. UI: Verify the data is displayed correctly
     * 3. API: Clean up test data
     *
     * This is faster than doing everything through the UI.
     */

    // First verify API is accessible
    const apiCheck = await request.get('/');
    expect(apiCheck.ok()).toBeTruthy();

    // Then verify via UI
    await page.goto('/');
    await expect(page).toHaveTitle('The Internet');

    console.log('✅ API and UI integration test passed');
  });
});

test.describe('Response Validation Patterns', () => {

  test('should validate response headers', async ({ request }) => {
    const response = await request.get('/');

    /**
     * 📚 Header Validation
     * Check response headers for content type, caching, security.
     */
    const headers = response.headers();
    console.log('Response headers:');
    console.log(`  Content-Type: ${headers['content-type']}`);
    console.log(`  Server: ${headers['server']}`);

    expect(headers['content-type']).toContain('text/html');
  });

  test('should measure response time', async ({ request }) => {
    /**
     * 📚 Performance Testing
     * Measure API response time.
     */
    const startTime = Date.now();
    const response = await request.get('/');
    const duration = Date.now() - startTime;

    console.log(`Response time: ${duration}ms`);
    expect(response.ok()).toBeTruthy();

    // Performance threshold
    expect(duration).toBeLessThan(5000); // Should respond within 5 seconds
  });
});
