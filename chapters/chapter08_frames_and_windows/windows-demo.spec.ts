/**
 * ============================================================
 * CHAPTER 08: MULTIPLE WINDOWS/TABS
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('Multiple Windows', () => {

  test('should handle new window opened by link', async ({ page, context }) => {
    await page.goto('/windows');

    /**
     * 📚 Handling New Windows/Tabs
     *
     * When a click opens a new tab/window:
     * 1. Set up listener for 'page' event BEFORE clicking
     * 2. The event gives you the new Page object
     * 3. Wait for the new page to load
     * 4. Interact with the new page
     *
     * 💡 Use Promise.all to avoid race conditions:
     * Listen for the event AND click simultaneously.
     */
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: 'Click Here' }).click(),
    ]);

    // Wait for the new page to fully load
    await newPage.waitForLoadState('domcontentloaded');

    // Verify the new page content
    await expect(newPage.locator('h3')).toHaveText('New Window');
    console.log(`New window URL: ${newPage.url()}`);

    // You can interact with BOTH pages
    console.log(`Original page URL: ${page.url()}`);
    await expect(page.locator('h3')).toHaveText('Opening a new window');

    // Close the new page
    await newPage.close();
  });

  test('should switch between multiple pages', async ({ page, context }) => {
    await page.goto('/windows');

    // Open new window
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: 'Click Here' }).click(),
    ]);
    await newPage.waitForLoadState();

    /**
     * 📚 Accessing All Pages
     * context.pages() returns all open pages in the context.
     * You can switch between them freely.
     */
    const allPages = context.pages();
    console.log(`Total pages open: ${allPages.length}`);

    // Work with original page
    await allPages[0].bringToFront();
    await expect(allPages[0].locator('h3')).toHaveText('Opening a new window');

    // Work with new page
    await allPages[1].bringToFront();
    await expect(allPages[1].locator('h3')).toHaveText('New Window');

    await newPage.close();
  });
});
