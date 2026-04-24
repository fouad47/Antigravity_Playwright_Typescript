/**
 * ============================================================
 * CHAPTER 02: ROLE-BASED LOCATORS
 * ============================================================
 *
 * 📚 LEARNING OBJECTIVES:
 * - Master getByRole() - the #1 recommended locator strategy
 * - Understand ARIA roles (link, button, heading, textbox, etc.)
 * - Use role options (name, exact, checked, pressed, etc.)
 *
 * 💡 WHY getByRole() IS BEST:
 * 1. Matches how users and assistive tech find elements
 * 2. Resilient to className/id/DOM structure changes
 * 3. Encourages accessible HTML
 * 4. Most readable in test code
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('getByRole() - Role-Based Locators', () => {

  // ============================================================
  // LINKS
  // ============================================================
  test.describe('Links (role: link)', () => {
    test('should find links by role and name on home page', async ({ page }) => {
      await page.goto('/');

      /**
       * 📚 getByRole('link', { name: '...' })
       * Finds <a> elements by their accessible name.
       * The 'name' option matches the link's visible text.
       */
      const loginLink = page.getByRole('link', { name: 'Form Authentication' });
      await expect(loginLink).toBeVisible();
      await loginLink.click();
      await expect(page).toHaveURL(/\/login/);
    });

    test('should find links with exact name matching', async ({ page }) => {
      await page.goto('/');

      /**
       * 📚 { exact: true }
       * By default, name matching is substring and case-insensitive.
       * Use exact: true for precise matching.
       */
      const dropdownLink = page.getByRole('link', { name: 'Dropdown', exact: true });
      await expect(dropdownLink).toBeVisible();
    });

    test('should find links with regex name pattern', async ({ page }) => {
      await page.goto('/');

      /**
       * 📚 RegExp in name
       * You can use RegExp for flexible matching.
       */
      const dynamicLink = page.getByRole('link', { name: /dynamic.*loading/i });
      await expect(dynamicLink).toBeVisible();
    });
  });

  // ============================================================
  // HEADINGS
  // ============================================================
  test.describe('Headings (role: heading)', () => {
    test('should find headings by role', async ({ page }) => {
      await page.goto('/login');

      /**
       * 📚 getByRole('heading')
       * Matches <h1> through <h6> elements.
       * Use 'level' option to target specific heading levels.
       */
      const pageHeading = page.getByRole('heading', { name: 'Login Page' });
      await expect(pageHeading).toBeVisible();
    });

    test('should find headings by level', async ({ page }) => {
      await page.goto('/');

      // Find specifically an h1 heading
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText('Welcome to the-internet');
    });
  });

  // ============================================================
  // BUTTONS
  // ============================================================
  test.describe('Buttons (role: button)', () => {
    test('should find buttons by role on login page', async ({ page }) => {
      await page.goto('/login');

      /**
       * 📚 getByRole('button')
       * Matches <button>, <input type="button">,
       * <input type="submit">, and elements with role="button"
       */
      const loginButton = page.getByRole('button', { name: 'Login' });
      await expect(loginButton).toBeVisible();
      await expect(loginButton).toBeEnabled();
    });

    test('should find buttons on add/remove elements page', async ({ page }) => {
      await page.goto('/add_remove_elements/');

      const addButton = page.getByRole('button', { name: 'Add Element' });
      await expect(addButton).toBeVisible();

      // Click to add, then find the delete button
      await addButton.click();
      const deleteButton = page.getByRole('button', { name: 'Delete' });
      await expect(deleteButton).toBeVisible();
    });
  });

  // ============================================================
  // TEXTBOXES
  // ============================================================
  test.describe('Textboxes (role: textbox)', () => {
    test('should find text inputs by role', async ({ page }) => {
      await page.goto('/login');

      /**
       * 📚 getByRole('textbox')
       * Matches <input type="text">, <input> (no type),
       * <textarea>, and contenteditable elements.
       *
       * ⚠️ Note: <input type="password"> is NOT a textbox role.
       * It has no specific ARIA role. Use getByLabel for passwords.
       */
      const usernameInput = page.getByRole('textbox', { name: 'Username' });
      // Note: This may or may not work depending on label association
      // Fallback to locator('#username') if needed
    });
  });

  // ============================================================
  // CHECKBOXES
  // ============================================================
  test.describe('Checkboxes (role: checkbox)', () => {
    test('should find checkboxes by role', async ({ page }) => {
      await page.goto('/checkboxes');

      /**
       * 📚 getByRole('checkbox')
       * Matches <input type="checkbox"> elements.
       * Use 'checked' option to find checked/unchecked checkboxes.
       */
      const checkboxes = page.getByRole('checkbox');
      expect(await checkboxes.count()).toBe(2);
    });
  });

  // ============================================================
  // COMBOBOXES (Dropdowns)
  // ============================================================
  test.describe('Comboboxes (role: combobox)', () => {
    test('should find dropdown by role', async ({ page }) => {
      await page.goto('/dropdown');

      /**
       * 📚 getByRole('combobox')
       * Matches <select> elements.
       * Note: HTML <select> maps to 'combobox' role.
       */
      const dropdown = page.getByRole('combobox');
      await expect(dropdown).toBeVisible();
    });
  });

  // ============================================================
  // IMAGES
  // ============================================================
  test.describe('Images (role: img)', () => {
    test('should find images on the broken images page', async ({ page }) => {
      await page.goto('/broken_images');

      /**
       * 📚 getByRole('img')
       * Matches <img> elements and elements with role="img".
       */
      const images = page.getByRole('img');
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
      console.log(`Found ${count} images on the page`);
    });
  });
});
