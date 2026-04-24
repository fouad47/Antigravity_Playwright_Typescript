/**
 * ============================================================
 * CHAPTER 03: SELECTOR STRATEGIES DEEP DIVE
 * ============================================================
 *
 * 📚 LEARNING OBJECTIVES:
 * - Understand Playwright's selector engine architecture
 * - Compare different selector approaches for the same element
 * - Build selectors that survive refactoring
 * - Learn Playwright-specific selector extensions
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('Selector Best Practices', () => {

  test('should demonstrate multiple ways to select the same element', async ({ page }) => {
    await page.goto('/login');

    /**
     * 📚 MULTIPLE SELECTORS FOR THE SAME ELEMENT
     * Here we show 5 ways to find the login button.
     * From BEST to WORST in terms of resilience:
     */

    // ✅ BEST: getByRole - semantic and accessible
    const byRole = page.getByRole('button', { name: 'Login' });

    // ✅ GOOD: getByText - readable and user-facing
    const byText = page.getByText('Login', { exact: true }).first();

    // ⚠️ OK: CSS with type selector
    const byCss = page.locator('button[type="submit"]');

    // ⚠️ LESS IDEAL: CSS with class
    const byClass = page.locator('button.radius');

    // ❌ AVOID: XPath (brittle, hard to read)
    const byXpath = page.locator('xpath=//button[@type="submit"]');

    // All five locate the same button
    await expect(byRole).toBeVisible();
    await expect(byCss).toBeVisible();
  });
});

test.describe('Playwright-Specific Selectors', () => {

  test('should use text selector engine', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 Playwright Text Selectors
     * - text="exact text" (or 'exact text')
     * - text=substring (case-insensitive substring)
     * - /regex/flags
     */
    // Case-insensitive substring match
    const checksLink = page.locator('text=Checkboxes');
    await expect(checksLink).toBeVisible();
  });

  test('should use Playwright :visible pseudo-class', async ({ page }) => {
    await page.goto('/login');

    /**
     * 📚 :visible pseudo-class
     * Playwright's custom pseudo-class to match only visible elements.
     * Useful when the DOM contains hidden duplicates.
     */
    const visibleInput = page.locator('input:visible');
    const count = await visibleInput.count();
    console.log(`Found ${count} visible inputs`);
    expect(count).toBeGreaterThan(0);
  });

  test('should use :text() pseudo-class', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 :text() pseudo-class
     * Playwright-specific pseudo-class for text matching.
     * More powerful than CSS :contains() (which browsers don't support).
     *
     * - :text("exact") - Exact text match
     * - :text-is("exact") - Full string match
     * - :text-matches("regex") - Regex match
     */
    const linkWithText = page.locator('a:text("Drag and Drop")');
    await expect(linkWithText).toBeVisible();

    const headerText = page.locator('h1:text-is("Welcome to the-internet")');
    await expect(headerText).toBeVisible();
  });

  test('should use nth-match selector', async ({ page }) => {
    await page.goto('/checkboxes');

    /**
     * 📚 :nth-match() pseudo-class
     * Select the Nth element matching a selector.
     * 1-indexed (first match is :nth-match(selector, 1)).
     */
    // Get the second checkbox
    const secondCheckbox = page.locator(':nth-match(input[type="checkbox"], 2)');
    await expect(secondCheckbox).toBeVisible();
  });
});

test.describe('Selector Resilience Patterns', () => {

  test('should demonstrate fragile vs resilient selectors', async ({ page }) => {
    await page.goto('/tables');

    /**
     * 📚 FRAGILE SELECTORS (Don't do this):
     * ❌ body > div > div > table > tbody > tr:nth-child(1) > td:nth-child(1)
     * ❌ /html/body/div[2]/div[1]/div/table[1]/tbody/tr[1]/td[1]
     *
     * These breaks when:
     * - A wrapper div is added
     * - Element order changes
     * - New elements are inserted
     *
     * RESILIENT SELECTORS (Do this):
     * ✅ page.locator('#table1 tbody tr').first().locator('td').first()
     * ✅ Semantic IDs, data-testid attributes
     * ✅ Role-based locators
     */

    // Resilient approach
    const table = page.locator('#table1');
    const firstRow = table.locator('tbody tr').first();
    const firstCell = firstRow.locator('td').first();
    const text = await firstCell.textContent();
    expect(text).toBeTruthy();
    console.log(`Resilient selector found: "${text}"`);
  });

  test('should handle dynamic IDs gracefully', async ({ page }) => {
    await page.goto('/challenging_dom');

    /**
     * 📚 HANDLING DYNAMIC IDs AND CLASSES
     * Some apps generate random IDs/classes on each page load.
     * Strategy: Don't rely on them!
     *
     * Instead use:
     * 1. Structural selectors (nth-child, adjacent siblings)
     * 2. Text content
     * 3. Stable parent containers
     * 4. Custom data attributes
     */
    // The challenging DOM page has buttons with dynamic IDs
    // Use class-based selectors instead
    const blueButton = page.locator('a.button:not(.alert):not(.success)');
    await expect(blueButton).toBeVisible();

    // Or use position-based selection
    const firstButton = page.locator('.large-2 a.button').first();
    await expect(firstButton).toBeVisible();
  });
});

test.describe('Selector Debugging', () => {

  test('should demonstrate selector debugging techniques', async ({ page }) => {
    await page.goto('/');
    
    /**
     * 📚 DEBUGGING SELECTORS
     *
     * 1. Playwright Inspector:
     *    npx playwright test --debug
     *    Click "Pick Locator" to explore elements
     *
     * 2. page.locator().highlight():
     *    Highlights the matched elements (debug mode only)
     *
     * 3. locator.count():
     *    Check how many elements match
     *
     * 4. Console: document.querySelectorAll('selector')
     *    Test CSS selectors in browser DevTools
     */
    const links = page.locator('#content ul li a');
    const count = await links.count();
    console.log(`Selector '#content ul li a' matches ${count} elements`);

    // Verify specificity - only one match is ideal
    const specificLink = page.getByRole('link', { name: 'Checkboxes', exact: true });
    const specificCount = await specificLink.count();
    console.log(`Specific selector matches ${specificCount} element(s)`);
    expect(specificCount).toBe(1); // Should be exactly 1
  });
});
