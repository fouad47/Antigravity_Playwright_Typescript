/**
 * ============================================================
 * CHAPTER 04: CLICK AND FILL INTERACTIONS
 * ============================================================
 *
 * 📚 LEARNING OBJECTIVES:
 * - Master click(), fill(), type(), clear()
 * - Understand click options (modifiers, position, force)
 * - Learn input interaction best practices
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('Click Interactions', () => {

  test('should perform a basic click on login button', async ({ page }) => {
    await page.goto('/login');

    /**
     * 📚 click()
     * Performs a click on an element.
     * Auto-waits for: element visible, stable, enabled, receives events
     */
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
  });

  test('should double-click an element', async ({ page }) => {
    await page.goto('/add_remove_elements/');

    /**
     * 📚 dblclick()
     * Performs a double-click. Useful for:
     * - Editing table cells
     * - Selecting words
     * - Double-click handlers
     */
    await page.getByRole('button', { name: 'Add Element' }).dblclick();
    // dblclick fires two click events
  });

  test('should right-click (context menu)', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 click({ button: 'right' })
     * Right-click to open context menus.
     */
    await page.locator('h1').click({ button: 'right' });
    // Context menu behavior depends on the application
  });

  test('should click with modifiers', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 Click with Keyboard Modifiers
     * Options:
     * - modifiers: ['Shift'] - Shift+click
     * - modifiers: ['Control'] - Ctrl+click (opens in new tab)
     * - modifiers: ['Meta'] - Cmd+click (Mac)
     * - modifiers: ['Alt'] - Alt+click
     */
    // Ctrl+click typically opens in new tab (browser-dependent)
    const link = page.getByRole('link', { name: 'Checkboxes' });
    await expect(link).toBeVisible();
  });

  test('should click at specific position', async ({ page }) => {
    await page.goto('/login');

    /**
     * 📚 click({ position: { x, y } })
     * Click at a specific offset within the element.
     * Coordinates are relative to the element's top-left corner.
     */
    const button = page.getByRole('button', { name: 'Login' });
    
    // Fill in credentials first
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    
    // Click at center of button
    const box = await button.boundingBox();
    if (box) {
      await button.click({
        position: { x: box.width / 2, y: box.height / 2 },
      });
    }
  });

  test('should force click on obscured element', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 click({ force: true })
     * ⚠️ DANGER: Skips actionability checks.
     * Uses this ONLY when you're sure the element is there
     * but Playwright thinks it's covered by another element.
     *
     * 💡 Better approach: Fix the UI or scroll first.
     */
    const heading = page.locator('h1');
    await heading.click({ force: true });
  });
});

test.describe('Fill Interactions', () => {

  test('should fill a text input', async ({ page }) => {
    await page.goto('/login');

    /**
     * 📚 fill()
     * Clears the input and types the text.
     * BEST for: Setting input values in forms.
     *
     * Key behavior:
     * - Clears existing text first
     * - Types all text at once (fast)
     * - Triggers input/change events
     */
    const username = page.locator('#username');
    await username.fill('tomsmith');
    await expect(username).toHaveValue('tomsmith');
  });

  test('should use pressSequentially for character-by-character typing', async ({ page }) => {
    await page.goto('/inputs');

    /**
     * 📚 pressSequentially() (formerly type())
     * Types text character by character, like a real user.
     * Use when:
     * - You need to trigger keydown/keyup events per character
     * - Testing autocomplete/suggestion features
     * - Testing input masks
     *
     * ⚠️ SLOWER than fill(). Use fill() for most cases.
     */
    const input = page.locator('input[type="number"]');
    await input.pressSequentially('42', { delay: 100 }); // 100ms between keystrokes
    await expect(input).toHaveValue('42');
  });

  test('should clear an input', async ({ page }) => {
    await page.goto('/inputs');

    /**
     * 📚 clear()
     * Removes all text from an input.
     * Alternative: fill('') also clears the input.
     */
    const input = page.locator('input[type="number"]');
    await input.fill('99');
    await expect(input).toHaveValue('99');

    await input.clear();
    await expect(input).toHaveValue('');
  });

  test('should fill and submit a login form', async ({ page }) => {
    await page.goto('/login');

    // Fill username
    await page.locator('#username').fill('tomsmith');

    // Fill password
    await page.locator('#password').fill('SuperSecretPassword!');

    /**
     * 📚 Using Enter key to submit a form
     * Instead of clicking the button, press Enter.
     * This tests keyboard accessibility.
     */
    await page.locator('#password').press('Enter');

    // Verify successful login
    await expect(page).toHaveURL(/\/secure/);
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
  });
});
