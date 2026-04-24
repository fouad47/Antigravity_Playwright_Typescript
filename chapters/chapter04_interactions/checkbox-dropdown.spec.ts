/**
 * ============================================================
 * CHAPTER 04: CHECKBOX AND DROPDOWN INTERACTIONS
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('Checkbox Interactions', () => {

  test('should check and uncheck checkboxes', async ({ page }) => {
    await page.goto('/checkboxes');

    const checkbox1 = page.locator('#checkboxes input').first();
    const checkbox2 = page.locator('#checkboxes input').last();

    /**
     * 📚 check() and uncheck()
     * check() - Checks a checkbox (no-op if already checked)
     * uncheck() - Unchecks a checkbox (no-op if already unchecked)
     *
     * 💡 These are idempotent - safe to call regardless of state.
     */
    await checkbox1.check();
    await expect(checkbox1).toBeChecked();

    await checkbox1.uncheck();
    await expect(checkbox1).not.toBeChecked();

    // Toggle using setChecked
    await checkbox2.setChecked(false);
    await expect(checkbox2).not.toBeChecked();

    await checkbox2.setChecked(true);
    await expect(checkbox2).toBeChecked();
  });

  test('should verify initial checkbox states', async ({ page }) => {
    await page.goto('/checkboxes');

    /**
     * 📚 isChecked()
     * Returns the current checked state as boolean.
     * Also available as assertion: expect().toBeChecked()
     */
    const checkboxes = page.locator('#checkboxes input');
    const initialStates = [];

    for (let i = 0; i < await checkboxes.count(); i++) {
      initialStates.push(await checkboxes.nth(i).isChecked());
    }

    console.log('Initial checkbox states:', initialStates);
    // Default: first unchecked [false], second checked [true]
    expect(initialStates[0]).toBe(false);
    expect(initialStates[1]).toBe(true);
  });
});

test.describe('Dropdown Interactions', () => {

  test('should select dropdown option by visible text', async ({ page }) => {
    await page.goto('/dropdown');

    /**
     * 📚 selectOption()
     * Selects option(s) in a <select> element.
     *
     * Selection methods:
     * - { label: 'text' } - By visible text
     * - { value: 'val' } - By value attribute
     * - { index: 0 } - By index (0-based)
     * - 'value' - Shorthand for value
     */
    const dropdown = page.locator('#dropdown');

    // Select by visible text
    await dropdown.selectOption({ label: 'Option 1' });
    await expect(dropdown).toHaveValue('1');

    // Select by value
    await dropdown.selectOption({ value: '2' });
    await expect(dropdown).toHaveValue('2');

    // Select by index
    await dropdown.selectOption({ index: 1 }); // Option 1 (index 0 is the placeholder)
    await expect(dropdown).toHaveValue('1');
  });

  test('should get all dropdown options', async ({ page }) => {
    await page.goto('/dropdown');

    const options = page.locator('#dropdown option');
    const texts = await options.allTextContents();

    console.log('Dropdown options:', texts);
    expect(texts).toContain('Option 1');
    expect(texts).toContain('Option 2');
  });

  test('should verify selected option', async ({ page }) => {
    await page.goto('/dropdown');

    const dropdown = page.locator('#dropdown');
    await dropdown.selectOption('1');

    /**
     * 📚 inputValue()
     * Returns the current value of the input/select element.
     * For <select>, this is the value attribute of the selected option.
     */
    const selectedValue = await dropdown.inputValue();
    expect(selectedValue).toBe('1');
  });
});
