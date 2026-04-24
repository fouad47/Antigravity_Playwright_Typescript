/**
 * ============================================================
 * CHAPTER 04: KEYBOARD ACTIONS
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('Keyboard Interactions', () => {

  test('should press individual keys', async ({ page }) => {
    await page.goto('/key_presses');

    /**
     * 📚 press()
     * Presses a keyboard key. Supports:
     * - Characters: 'a', 'A', '1'
     * - Special keys: 'Enter', 'Tab', 'Escape', 'Space'
     * - Arrow keys: 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
     * - Modifiers: 'Shift', 'Control', 'Alt', 'Meta'
     * - Function keys: 'F1', 'F12'
     * - Combinations: 'Control+a', 'Shift+Enter'
     */
    const input = page.locator('#target');
    
    // Press letter key
    await input.press('A');
    await expect(page.locator('#result')).toContainText('A');

    // Press special key
    await input.press('Enter');
    await expect(page.locator('#result')).toContainText('ENTER');

    // Press arrow key
    await input.press('ArrowUp');
    await expect(page.locator('#result')).toContainText('UP');
  });

  test('should use keyboard shortcuts', async ({ page }) => {
    await page.goto('/inputs');

    /**
     * 📚 Keyboard Shortcuts
     * Combine keys with '+':
     * - 'Control+a' - Select all
     * - 'Control+c' - Copy
     * - 'Control+v' - Paste
     * - 'Shift+Tab' - Focus previous element
     */
    const input = page.locator('input[type="number"]');
    await input.fill('12345');

    // Select all text using keyboard shortcut
    await input.press('Control+a');
    // Type new text (replaces selected)
    await input.fill('99');
    await expect(input).toHaveValue('99');
  });

  test('should navigate with Tab key', async ({ page }) => {
    await page.goto('/login');

    /**
     * 📚 Tab Navigation
     * Tab moves focus between focusable elements.
     * Essential for accessibility testing.
     */
    // Focus username field
    const username = page.locator('#username');
    await username.focus();
    await username.fill('tomsmith');

    // Tab to password field
    await page.keyboard.press('Tab');
    
    // Type in the now-focused password field
    await page.keyboard.type('SuperSecretPassword!');
    
    // Tab to submit button and press Enter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/secure/);
  });

  test('should use page.keyboard for low-level control', async ({ page }) => {
    await page.goto('/key_presses');

    /**
     * 📚 page.keyboard
     * Low-level keyboard API.
     * Methods: down(), up(), press(), type(), insertText()
     *
     * down()/up() - Hold and release keys (for modifier combinations)
     * type() - Type text with keystrokes
     * insertText() - Insert text without firing key events
     */
    const input = page.locator('#target');
    await input.click();

    // Low-level key combination
    await page.keyboard.down('Shift');
    await page.keyboard.press('A');
    await page.keyboard.up('Shift');
    // This types uppercase 'A' by holding Shift

    await expect(page.locator('#result')).toContainText('A');
  });
});
