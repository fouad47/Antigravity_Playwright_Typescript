/**
 * ============================================================
 * PLAYWRIGHT CONFIGURATION FILE
 * ============================================================
 *
 * 📚 LEARNING NOTES:
 * This is the central configuration file for Playwright.
 * It controls how tests are discovered, run, and reported.
 *
 * Key concepts:
 * - defineConfig(): Type-safe configuration helper
 * - projects: Configure multiple browsers
 * - use: Global test options (base URL, screenshots, etc.)
 * - reporter: How test results are displayed
 * - retries: Auto-retry failed tests
 *
 * 💡 BEST PRACTICE: Keep config DRY by using environment
 * variables and shared settings objects.
 * ============================================================
 */

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * 📚 LEARNING NOTE:
 * defineConfig() provides TypeScript IntelliSense for all config options.
 * Always use it instead of plain objects for better developer experience.
 */
export default defineConfig({
  // ============================================================
  // TEST DISCOVERY
  // ============================================================

  /**
   * Directory where Playwright looks for test files.
   * We include both 'tests/' and 'chapters/' directories
   * so chapter examples and framework tests both run.
   */
  testDir: '.',
  testMatch: [
    'chapters/**/*.spec.ts',
    'tests/**/*.spec.ts',
  ],

  // Global setup and teardown
  globalSetup: require.resolve('./src/global-setup.ts'),
  globalTeardown: require.resolve('./src/global-teardown.ts'),

  // ============================================================
  // EXECUTION SETTINGS
  // ============================================================

  /**
   * Maximum time a single test can run before timing out.
   * 📚 30 seconds is a good default for UI tests.
   * Increase for complex E2E flows.
   */
  timeout: 30_000,

  /**
   * Maximum time for expect() assertions.
   * Playwright auto-retries assertions until this timeout.
   */
  expect: {
    timeout: 5_000,
    /**
     * Configuration for visual regression testing (Chapter 17).
     * maxDiffPixels: Allow small rendering differences.
     * threshold: Color difference tolerance (0 = exact, 1 = any).
     */
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
    toMatchSnapshot: {
      maxDiffPixelRatio: 0.05,
    },
  },

  /**
   * Run tests in parallel across files.
   * 📚 Set to false for debugging, true for CI speed.
   */
  fullyParallel: true,

  /**
   * Fail the build on CI if test.only is accidentally left in code.
   * This prevents incomplete test suites from passing CI.
   */
  forbidOnly: !!process.env.CI,

  /**
   * Retry failed tests.
   * 📚 BEST PRACTICE: Retry only on CI where flakiness
   * from environment is more common.
   */
  retries: process.env.CI ? 2 : 0,

  /**
   * Number of parallel worker processes.
   * 📚 On CI, limit workers to avoid resource contention.
   * Locally, use more workers for speed.
   */
  workers: process.env.CI ? 1 : undefined,

  // ============================================================
  // REPORTING
  // ============================================================

  /**
   * 📚 LEARNING NOTE:
   * Multiple reporters can run simultaneously.
   * - 'html': Beautiful interactive report (open with `npx playwright show-report`)
   * - 'list': Console output during execution
   * - 'json': Machine-readable results
   * - 'junit': CI/CD integration (Jenkins, GitHub Actions)
   */
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'logs/test-results.json' }],
  ],

  // ============================================================
  // GLOBAL TEST OPTIONS (shared across all projects)
  // ============================================================

  use: {
    /**
     * Base URL for all page.goto() calls.
     * Instead of: page.goto('https://the-internet.herokuapp.com/login')
     * You write: page.goto('/login')
     *
     * 📚 BEST PRACTICE: Always use baseURL for maintainability.
     * Change one place to switch environments.
     */
    baseURL: process.env.BASE_URL || 'https://the-internet.herokuapp.com',

    /**
     * Capture screenshots on test failure.
     * Options: 'on', 'off', 'only-on-failure'
     */
    screenshot: 'only-on-failure',

    /**
     * Record video of test execution.
     * 📚 'retain-on-failure' saves disk space by only keeping
     * videos of failed tests.
     */
    video: 'retain-on-failure',

    /**
     * Capture execution trace for debugging.
     * 📚 Traces include DOM snapshots, network logs, and
     * action logs. Open with: npx playwright show-trace trace.zip
     */
    trace: 'retain-on-failure',

    /**
     * Extra HTTP headers sent with every request.
     * Useful for authentication tokens or custom headers.
     */
    extraHTTPHeaders: {
      'Accept': 'text/html,application/json',
    },

    /**
     * Navigation timeout for page.goto() calls.
     */
    navigationTimeout: 15_000,

    /**
     * Action timeout for click(), fill(), etc.
     */
    actionTimeout: 10_000,
  },

  // ============================================================
  // BROWSER PROJECTS
  // ============================================================

  /**
   * 📚 LEARNING NOTE:
   * Projects allow running the same tests across different browsers.
   * Each project can have its own settings that override global 'use'.
   *
   * devices['Desktop Chrome'] provides realistic device emulation
   * including viewport, userAgent, and other device properties.
   */
  projects: [
    // --- Desktop Browsers ---
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        /**
         * 📚 Viewport size affects responsive behavior.
         * Always set explicit viewport for consistent tests.
         */
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // --- Mobile Browsers (bonus cross-device testing) ---
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13'],
      },
    },
  ],

  // ============================================================
  // OUTPUT DIRECTORIES
  // ============================================================

  /**
   * Directory for test artifacts (screenshots, videos, traces).
   */
  outputDir: './test-results',
});
