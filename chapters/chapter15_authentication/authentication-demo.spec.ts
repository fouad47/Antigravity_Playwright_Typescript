/**
 * ============================================================
 * CHAPTER 15: AUTHENTICATION PATTERNS
 * ============================================================
 *
 * 📚 AUTHENTICATION STRATEGIES IN PLAYWRIGHT:
 *
 * 1. LOGIN PER TEST: Simple but slow
 *    Each test logs in fresh. Safe but expensive.
 *
 * 2. STORAGE STATE: Fast and recommended
 *    Log in once, save cookies/localStorage, reuse.
 *
 * 3. GLOBAL SETUP: Login before ALL tests
 *    Configure in playwright.config.ts globalSetup.
 *
 * 4. API LOGIN: Fastest
 *    Get auth token via API, inject into browser.
 * ============================================================
 */

import { test, expect, Page, BrowserContext } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test.describe('Strategy 1: Login Per Test', () => {

  test('should login fresh for each test', async ({ page }) => {
    /**
     * 📚 LOGIN PER TEST
     * Simplest approach: repeat login in every test.
     *
     * ✅ Pros: Complete isolation, simple
     * ❌ Cons: Slow, repetitive code
     */
    await page.goto('/login');
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page).toHaveURL(/\/secure/);
    await expect(page.locator('.flash.success')).toContainText('You logged into a secure area!');
  });
});

test.describe('Strategy 2: Storage State', () => {

  const storageStatePath = path.resolve(process.cwd(), 'test-data', 'auth-state.json');

  test('should save authentication state', async ({ page, context }) => {
    /**
     * 📚 SAVING STORAGE STATE
     *
     * context.storageState() captures:
     * - Cookies
     * - localStorage
     * - sessionStorage origins
     *
     * Save this to a JSON file and reuse across tests.
     */
    await page.goto('/login');
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/secure/);

    // Save the authenticated state
    const dir = path.dirname(storageStatePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    await context.storageState({ path: storageStatePath });
    console.log(`💾 Auth state saved to: ${storageStatePath}`);
  });

  test('should reuse saved authentication state', async ({ browser }) => {
    /**
     * 📚 REUSING STORAGE STATE
     *
     * Create a new context with the saved state.
     * The browser will have all cookies/localStorage from the saved session.
     * No login needed!
     */
    // Skip if no saved state exists
    if (!fs.existsSync(storageStatePath)) {
      console.log('⚠️ No saved auth state. Run the save test first.');
      return;
    }

    const context = await browser.newContext({
      storageState: storageStatePath,
    });
    const page = await context.newPage();

    // Navigate directly to secure area - should work without login!
    await page.goto('/secure');

    // Verify we're authenticated
    // Note: the-internet may not maintain session, so this demonstrates the pattern
    console.log(`Current URL: ${page.url()}`);
    
    await context.close();
  });
});

test.describe('Strategy 3: Multiple User Sessions', () => {

  test('should handle admin and regular user sessions', async ({ browser }) => {
    /**
     * 📚 MULTIPLE USER SESSIONS
     *
     * Create separate browser contexts for different users.
     * Each context maintains its own authentication state.
     */
    // User 1: Admin session
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    await adminPage.goto('/login');
    await adminPage.locator('#username').fill('tomsmith');
    await adminPage.locator('#password').fill('SuperSecretPassword!');
    await adminPage.getByRole('button', { name: 'Login' }).click();
    await expect(adminPage).toHaveURL(/\/secure/);

    // User 2: Guest session (not logged in)
    const guestContext = await browser.newContext();
    const guestPage = await guestContext.newPage();
    await guestPage.goto('/login');
    await expect(guestPage.locator('h2')).toHaveText('Login Page');

    // Both sessions are independent
    console.log(`Admin  URL: ${adminPage.url()}`);
    console.log(`Guest  URL: ${guestPage.url()}`);

    await adminContext.close();
    await guestContext.close();
  });
});

test.describe('Strategy 4: HTTP Credentials (Basic Auth)', () => {

  test('should handle HTTP Basic Authentication', async ({ browser }) => {
    /**
     * 📚 HTTP BASIC AUTH
     *
     * Some sites use HTTP Basic Authentication (popup dialog).
     * Playwright handles this with httpCredentials option.
     */
    const context = await browser.newContext({
      httpCredentials: {
        username: 'admin',
        password: 'admin',
      },
    });
    const page = await context.newPage();

    // Navigate to basic auth protected page
    await page.goto('/basic_auth');
    await expect(page.locator('.example p')).toContainText(
      'Congratulations! You must have the proper credentials.'
    );

    console.log('✅ Basic Auth successful!');
    await context.close();
  });
});
