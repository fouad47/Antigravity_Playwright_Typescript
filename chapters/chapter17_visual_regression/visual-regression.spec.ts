/**
 * ============================================================
 * CHAPTER 17: VISUAL REGRESSION TESTING
 * ============================================================
 *
 * 📚 Visual regression detects unexpected UI changes by
 * comparing screenshots against saved baselines.
 *
 * WORKFLOW:
 * 1. First run: Creates baseline screenshots
 * 2. Subsequent runs: Compares against baselines
 * 3. Differences > threshold → Test fails
 * 4. Accept changes: npx playwright test --update-snapshots
 *
 * 💡 TIP: Run with a single browser for consistent baselines.
 *    npx playwright test --project=chromium
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('Page-Level Visual Regression', () => {

  test('should match homepage screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    /**
     * 📚 toHaveScreenshot()
     * Takes a screenshot and compares to baseline.
     *
     * First run: Creates the baseline in __snapshots__ folder.
     * Next runs: Compares current screenshot to baseline.
     *
     * Options:
     * - maxDiffPixels: Max different pixels allowed
     * - maxDiffPixelRatio: Max ratio of different pixels
     * - threshold: Color diff tolerance (0-1)
     * - fullPage: Capture full scrollable page
     */
    await expect(page).toHaveScreenshot('homepage.png', {
      maxDiffPixels: 200,
      fullPage: true,
    });
  });

  test('should match login page screenshot', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match checkboxes page screenshot', async ({ page }) => {
    await page.goto('/checkboxes');

    await expect(page).toHaveScreenshot('checkboxes-page.png', {
      maxDiffPixels: 100,
    });
  });
});

test.describe('Element-Level Visual Regression', () => {

  test('should match login form screenshot', async ({ page }) => {
    await page.goto('/login');

    /**
     * 📚 Element Screenshots
     * Take screenshots of specific elements only.
     * More stable than full-page screenshots because
     * they ignore changes outside the element.
     */
    const loginForm = page.locator('#login');
    await expect(loginForm).toHaveScreenshot('login-form.png', {
      maxDiffPixels: 50,
    });
  });

  test('should match table screenshot', async ({ page }) => {
    await page.goto('/tables');

    const table = page.locator('#table1');
    await expect(table).toHaveScreenshot('data-table.png', {
      maxDiffPixels: 100,
    });
  });
});

test.describe('Visual Testing with State Changes', () => {

  test('should detect visual changes after checkbox toggle', async ({ page }) => {
    await page.goto('/checkboxes');

    // Baseline: Default state
    await expect(page.locator('#checkboxes')).toHaveScreenshot(
      'checkboxes-default.png',
      { maxDiffPixels: 50 }
    );

    // Change state
    const checkbox1 = page.locator('#checkboxes input').first();
    await checkbox1.check();

    // New state should be visually different
    await expect(page.locator('#checkboxes')).toHaveScreenshot(
      'checkboxes-modified.png',
      { maxDiffPixels: 50 }
    );
  });

  test('should compare before and after visual states', async ({ page }) => {
    await page.goto('/dynamic_controls');

    /**
     * 📚 Capturing Different States
     * Take screenshots at different points to track visual changes.
     */
    // Before state
    await expect(page.locator('#checkbox-example')).toHaveScreenshot(
      'dynamic-controls-before.png',
      { maxDiffPixels: 50 }
    );
  });
});

test.describe('Screenshot Configuration', () => {

  test('should take screenshots with custom viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');

    /**
     * 📚 Viewport-Specific Screenshots
     * Set viewport before screenshot for responsive testing.
     * Create separate baselines for different viewports.
     */
    await expect(page).toHaveScreenshot('homepage-1024x768.png', {
      maxDiffPixels: 200,
      fullPage: true,
    });
  });

  test('should mask dynamic elements in screenshots', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 Masking Dynamic Elements
     * Use 'mask' option to hide elements that change
     * between runs (timestamps, ads, random content).
     */
    await expect(page).toHaveScreenshot('homepage-masked.png', {
      mask: [page.locator('#page-footer')], // Mask the footer
      maxDiffPixels: 200,
    });
  });
});
