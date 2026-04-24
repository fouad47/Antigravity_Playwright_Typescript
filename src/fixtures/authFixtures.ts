/**
 * ============================================================
 * AUTH FIXTURES - Authentication Setup Fixtures
 * ============================================================
 *
 * 📚 LEARNING NOTES:
 * Authentication fixtures demonstrate:
 * 1. Storage State: Save/restore browser session (cookies, localStorage)
 * 2. Login Reuse: Log in once, use the session for many tests
 * 3. Session Handling: Manage different user sessions
 *
 * 💡 BEST PRACTICE:
 * Don't log in for every test! Use storage state to save
 * the authentication session and reuse it across tests.
 * This dramatically speeds up test execution.
 * ============================================================
 */

import { test as base, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Path to store authentication state.
 */
const AUTH_DIR = path.resolve(process.cwd(), 'src/fixtures/.auth');
const STORAGE_STATE_PATH = path.join(AUTH_DIR, 'storageState.json');

type AuthFixtures = {
  /** A browser context that is already authenticated */
  authenticatedContext: BrowserContext;
  /** A page from the authenticated context */
  authenticatedPage: import('@playwright/test').Page;
};

/**
 * Auth fixtures that provide pre-authenticated browser contexts.
 *
 * 📚 LEARNING NOTE:
 * The 'authenticatedContext' fixture:
 * 1. Checks if a stored session exists
 * 2. If yes, creates a new context with that session
 * 3. If no, logs in fresh and saves the session
 *
 * This means the login flow only runs ONCE per test suite.
 */
export const authTest = base.extend<AuthFixtures>({
  authenticatedContext: async ({ browser }, use) => {
    // Ensure auth directory exists
    if (!fs.existsSync(AUTH_DIR)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
    }

    let context: BrowserContext;

    if (fs.existsSync(STORAGE_STATE_PATH)) {
      // Reuse existing session
      console.log('🔐 Reusing saved authentication session');
      context = await browser.newContext({ storageState: STORAGE_STATE_PATH });
    } else {
      // Create new session by logging in
      console.log('🔐 Creating new authentication session');
      context = await browser.newContext();
      const page = await context.newPage();
      const loginPage = new LoginPage(page);

      await loginPage.navigateTo();
      await loginPage.loginWithDefaults();
      await loginPage.assertLoginSuccess();

      // Save storage state for future reuse
      await context.storageState({ path: STORAGE_STATE_PATH });
      console.log(`💾 Auth session saved to: ${STORAGE_STATE_PATH}`);
      await page.close();
    }

    await use(context);
    await context.close();
  },

  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await use(page);
  },
});

/**
 * Clear saved authentication state.
 * Useful in afterAll or when sessions expire.
 */
export function clearAuthState(): void {
  if (fs.existsSync(STORAGE_STATE_PATH)) {
    fs.unlinkSync(STORAGE_STATE_PATH);
    console.log('🗑️ Auth state cleared');
  }
}

export { STORAGE_STATE_PATH, AUTH_DIR };
