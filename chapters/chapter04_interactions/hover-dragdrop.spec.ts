/**
 * ============================================================
 * CHAPTER 04: HOVER AND DRAG-DROP INTERACTIONS
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('Hover Interactions', () => {

  test('should hover to reveal hidden content', async ({ page }) => {
    await page.goto('/hovers');

    /**
     * 📚 hover()
     * Moves the mouse over an element.
     * Useful for: tooltip display, dropdown menus, hidden actions
     */
    const figures = page.locator('.figure');
    const count = await figures.count();

    for (let i = 0; i < count; i++) {
      await figures.nth(i).hover();
      const caption = figures.nth(i).locator('.figcaption');
      await expect(caption).toBeVisible();

      const name = await caption.locator('h5').textContent();
      console.log(`User ${i + 1}: ${name}`);
    }
  });

  test('should hover and click revealed link', async ({ page }) => {
    await page.goto('/hovers');

    // Hover over first user
    const firstFigure = page.locator('.figure').first();
    await firstFigure.hover();

    // Click the revealed "View profile" link
    const viewProfileLink = firstFigure.locator('a');
    await expect(viewProfileLink).toBeVisible();
    await viewProfileLink.click();

    // Verify navigation
    await expect(page).toHaveURL(/\/users\//);
  });
});

test.describe('Drag and Drop', () => {

  test('should drag and drop using JavaScript events', async ({ page }) => {
    await page.goto('/drag_and_drop');

    /**
     * 📚 Drag and Drop
     * The-internet.herokuapp.com uses HTML5 drag-and-drop API
     * with jQuery, which may need JavaScript simulation.
     */
    const columnA = page.locator('#column-a');
    const columnB = page.locator('#column-b');

    // Verify initial state
    await expect(columnA).toContainText('A');
    await expect(columnB).toContainText('B');

    // Perform drag and drop via JavaScript
    await page.evaluate(() => {
      const source = document.querySelector('#column-a')!;
      const target = document.querySelector('#column-b')!;
      const dt = new DataTransfer();
      source.dispatchEvent(new DragEvent('dragstart', { dataTransfer: dt, bubbles: true }));
      target.dispatchEvent(new DragEvent('dragenter', { dataTransfer: dt, bubbles: true }));
      target.dispatchEvent(new DragEvent('dragover', { dataTransfer: dt, bubbles: true }));
      target.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true }));
      source.dispatchEvent(new DragEvent('dragend', { dataTransfer: dt, bubbles: true }));
    });

    // Verify columns swapped
    await expect(columnA).toContainText('B');
    await expect(columnB).toContainText('A');
  });
});

test.describe('Mouse Actions', () => {

  test('should demonstrate mouse move and click at coordinates', async ({ page }) => {
    await page.goto('/hovers');

    /**
     * 📚 page.mouse
     * Low-level mouse API for precise control.
     * Methods: move(), down(), up(), click(), dblclick(), wheel()
     *
     * 💡 Use high-level methods (hover, click) when possible.
     * Use page.mouse only for custom mouse interactions.
     */
    const figure = page.locator('.figure').first();
    const box = await figure.boundingBox();

    if (box) {
      // Move mouse to center of element
      await page.mouse.move(
        box.x + box.width / 2,
        box.y + box.height / 2
      );

      // Check that hover caption appeared
      const caption = figure.locator('.figcaption');
      await expect(caption).toBeVisible();
    }
  });
});
