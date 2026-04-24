/**
 * ============================================================
 * CHAPTER 08: FRAMES (iFrames)
 * ============================================================
 *
 * 📚 KEY CONCEPT:
 * Playwright uses frameLocator() to work with iframes.
 * Unlike Selenium (switchTo().frame()), Playwright doesn't
 * require switching context - you chain locators directly.
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('iFrame Handling', () => {

  test('should interact with content inside an iframe', async ({ page }) => {
    await page.goto('/iframe');

    /**
     * 📚 frameLocator()
     * Returns a FrameLocator that represents the iframe content.
     * All locators chained from FrameLocator search inside the iframe.
     *
     * NO need to "switch" to the frame like in Selenium!
     */
    const iframe = page.frameLocator('#mce_0_ifr');
    const editor = iframe.locator('#tinymce');

    // Read existing content
    const existingText = await editor.textContent();
    console.log(`Editor text: ${existingText}`);

    // Clear and type new content
    await editor.clear();
    await editor.fill('Hello from Playwright!');
    await expect(editor).toContainText('Hello from Playwright!');
  });

  test('should access iframe by other selectors', async ({ page }) => {
    await page.goto('/iframe');

    /**
     * 📚 Frame Locator Strategies:
     * - page.frameLocator('#id') - By ID
     * - page.frameLocator('[name="frameName"]') - By name attribute
     * - page.frameLocator('iframe[src*="partial-url"]') - By src
     * - page.frame({ url: /pattern/ }) - By URL pattern
     */
    // By CSS selector
    const iframe = page.frameLocator('iframe.tox-edit-area__iframe');
    const body = iframe.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Nested Frames', () => {

  test('should handle nested frames', async ({ page }) => {
    await page.goto('/nested_frames');

    /**
     * 📚 Nested Frames
     * Chain frameLocator() calls for nested frames.
     * Each call goes one level deeper.
     *
     * Structure:
     * page → frame-top → frame-left, frame-middle, frame-right
     * page → frame-bottom
     */

    // Access nested frame: page → top → middle
    const topFrame = page.frameLocator('frame[name="frame-top"]');
    const middleFrame = topFrame.frameLocator('frame[name="frame-middle"]');
    const middleContent = middleFrame.locator('#content');
    await expect(middleContent).toHaveText('MIDDLE');

    // Access nested frame: page → top → left
    const leftFrame = topFrame.frameLocator('frame[name="frame-left"]');
    const leftBody = leftFrame.locator('body');
    await expect(leftBody).toContainText('LEFT');

    // Access nested frame: page → top → right
    const rightFrame = topFrame.frameLocator('frame[name="frame-right"]');
    const rightBody = rightFrame.locator('body');
    await expect(rightBody).toContainText('RIGHT');

    // Access bottom frame (not nested)
    const bottomFrame = page.frameLocator('frame[name="frame-bottom"]');
    const bottomBody = bottomFrame.locator('body');
    await expect(bottomBody).toContainText('BOTTOM');
  });
});
