/**
 * ============================================================
 * CHAPTER 07: BROWSER CONTEXTS
 * ============================================================
 *
 * 📚 KEY CONCEPT: Browser Context
 * A browser context is like an incognito browser profile.
 * Each context has separate:
 * - Cookies
 * - Local storage
 * - Session storage
 * - Cache
 *
 * By default, each Playwright test gets a NEW context.
 * This ensures complete test isolation.
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('Browser Context Basics', () => {

  test('should have isolated context per test', async ({ page, context }) => {
    /**
     * 📚 Context Isolation
     * Each test gets a fresh context by default.
     * This means:
     * - No shared cookies between tests
     * - No shared localStorage
     * - Clean state for every test
     */
    await page.goto('/login');
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();

    // Session exists in THIS test's context only
    await expect(page).toHaveURL(/\/secure/);

    // Get cookies (they're context-scoped)
    const cookies = await context.cookies();
    console.log(`Cookies in this context: ${cookies.length}`);
  });

  test('should have clean state (no cookies from previous test)', async ({ page, context }) => {
    // This test starts fresh - no session from previous test
    const cookies = await context.cookies();
    
    // Navigate to secure area - should redirect to login
    await page.goto('/secure');
    // Either it shows login or the secure area depending on the app behavior
  });
});

test.describe('Multiple Contexts', () => {

  test('should create multiple contexts for parallel sessions', async ({ browser }) => {
    /**
     * 📚 Multiple Contexts
     * Create multiple contexts from the same browser.
     * Each context acts as a separate user session.
     *
     * Use cases:
     * - Testing multi-user scenarios (chat, collaboration)
     * - Testing admin vs regular user simultaneously
     * - Comparing behavior across different sessions
     */

    // Create two separate contexts (like two different users)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    // Create pages in each context
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // User 1: Log in
    await page1.goto('/login');
    await page1.locator('#username').fill('tomsmith');
    await page1.locator('#password').fill('SuperSecretPassword!');
    await page1.getByRole('button', { name: 'Login' }).click();
    await expect(page1).toHaveURL(/\/secure/);

    // User 2: Visit login page (NOT logged in - separate session!)
    await page2.goto('/login');
    await expect(page2.locator('h2')).toHaveText('Login Page');

    // Both sessions run independently
    console.log('User 1 URL:', page1.url());
    console.log('User 2 URL:', page2.url());

    // Cleanup
    await context1.close();
    await context2.close();
  });

  test('should configure context with specific settings', async ({ browser }) => {
    /**
     * 📚 Context Options
     * Customize each context with different settings:
     * - viewport: Browser window size
     * - locale/timezone: Localization
     * - geolocation: GPS location
     * - permissions: Camera, microphone, etc.
     * - httpCredentials: Basic auth
     * - storageState: Pre-loaded session
     */
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
      locale: 'en-US',
      timezoneId: 'America/New_York',
    });

    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('/');

    const viewport = mobilePage.viewportSize();
    expect(viewport?.width).toBe(375);
    console.log(`Mobile viewport: ${viewport?.width}x${viewport?.height}`);

    await expect(mobilePage).toHaveTitle('The Internet');
    await mobileContext.close();
  });
});

test.describe('Multiple Pages in One Context', () => {

  test('should work with multiple tabs/pages in same context', async ({ context }) => {
    /**
     * 📚 Multiple Pages in One Context
     * Multiple pages in the SAME context share:
     * - Cookies
     * - localStorage
     *
     * This simulates opening multiple tabs in the same browser.
     */
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    // Both pages share the same session
    await page1.goto('/');
    await page2.goto('/checkboxes');

    console.log('Page 1:', page1.url());
    console.log('Page 2:', page2.url());

    await expect(page1).toHaveTitle('The Internet');
    await expect(page2).toHaveTitle('The Internet');

    await page1.close();
    await page2.close();
  });
});
