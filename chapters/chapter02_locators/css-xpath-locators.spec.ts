/**
 * ============================================================
 * CHAPTER 02: CSS AND XPATH LOCATORS
 * ============================================================
 *
 * 📚 LEARNING OBJECTIVES:
 * - Use CSS selectors with page.locator()
 * - Use XPath selectors with page.locator()
 * - Understand when CSS/XPath are necessary
 * - Learn common CSS and XPath patterns
 *
 * ⚠️ WHEN TO USE CSS/XPATH:
 * Only use when getByRole/Text/Label/TestId can't work:
 * - Complex DOM structures
 * - Elements without text or roles
 * - Legacy apps without semantic HTML
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('CSS Selectors', () => {

  test('should find elements by ID', async ({ page }) => {
    await page.goto('/login');

    /**
     * 📚 CSS: #id
     * Select by element ID. IDs should be unique on a page.
     */
    const usernameInput = page.locator('#username');
    await expect(usernameInput).toBeVisible();
  });

  test('should find elements by class name', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 CSS: .className
     * Select by CSS class. May match multiple elements.
     */
    const heading = page.locator('.heading');
    await expect(heading).toBeVisible();
  });

  test('should find elements by tag name', async ({ page }) => {
    await page.goto('/login');

    /**
     * 📚 CSS: tagName
     * Select by HTML tag. Use sparingly - too generic.
     */
    const buttons = page.locator('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should find elements by attribute', async ({ page }) => {
    await page.goto('/login');

    /**
     * 📚 CSS: [attribute="value"]
     * Select by any HTML attribute.
     * Variations:
     * - [attr="value"] - Exact match
     * - [attr^="value"] - Starts with
     * - [attr$="value"] - Ends with
     * - [attr*="value"] - Contains
     * - [attr~="value"] - Word in space-separated list
     */
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();

    // Starts with
    const inputsStartingWithUser = page.locator('input[id^="user"]');
    await expect(inputsStartingWithUser).toBeVisible();
  });

  test('should find elements with compound selectors', async ({ page }) => {
    await page.goto('/challenging_dom');

    /**
     * 📚 CSS: Compound selectors combine conditions
     * - tag.class: <tag> with class
     * - tag#id: <tag> with ID
     * - tag[attr]: <tag> with attribute
     * - .class1.class2: Element with both classes
     */
    const alertButton = page.locator('a.button.alert');
    await expect(alertButton).toBeVisible();

    const successButton = page.locator('a.button.success');
    await expect(successButton).toBeVisible();
  });

  test('should find child and descendant elements', async ({ page }) => {
    await page.goto('/tables');

    /**
     * 📚 CSS: Combinators
     * - parent child: Descendant (any depth)
     * - parent > child: Direct child only
     * - element + sibling: Adjacent sibling
     * - element ~ sibling: General sibling
     */
    // Find all table cells (descendants)
    const cells = page.locator('#table1 tbody td');
    expect(await cells.count()).toBeGreaterThan(0);

    // Find direct children only
    const directRows = page.locator('#table1 > tbody > tr');
    expect(await directRows.count()).toBeGreaterThan(0);
  });

  test('should use pseudo-selectors', async ({ page }) => {
    await page.goto('/tables');

    /**
     * 📚 CSS: Pseudo-selectors
     * - :first-child, :last-child
     * - :nth-child(n), :nth-of-type(n)
     * - :not(.class)
     * - :has(selector) - Parent that contains child
     */
    // First table row
    const firstRow = page.locator('#table1 tbody tr:first-child');
    await expect(firstRow).toBeVisible();

    // Third column of each row
    const thirdCols = page.locator('#table1 tbody tr td:nth-child(3)');
    expect(await thirdCols.count()).toBeGreaterThan(0);

    // Last row
    const lastRow = page.locator('#table1 tbody tr:last-child');
    await expect(lastRow).toBeVisible();
  });

  test('should use :has-text() pseudo-selector', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 Playwright-specific: :has-text()
     * Find elements containing specific text.
     * Unlike getByText(), this returns the element itself.
     */
    const loginListItem = page.locator('li:has-text("Form Authentication")');
    await expect(loginListItem).toBeVisible();
  });

  test('should use :has() pseudo-selector', async ({ page }) => {
    await page.goto('/tables');

    /**
     * 📚 CSS: :has()
     * Find a parent that contains a specific child.
     * Example: Find table rows that contain "Smith".
     */
    const rowWithSmith = page.locator('#table1 tbody tr:has(td:text("Smith"))');
    await expect(rowWithSmith).toBeVisible();
  });
});

test.describe('XPath Selectors', () => {

  test('should find elements by XPath', async ({ page }) => {
    await page.goto('/login');

    /**
     * 📚 XPath Selectors
     * Prefix with 'xpath=' or '//' to use XPath.
     *
     * Common XPath axes:
     * - //tag: Find anywhere in DOM
     * - /html/body/...: Absolute path (AVOID - very brittle)
     * - //parent/child: Descendant
     * - //tag[@attr="value"]: By attribute
     */
    const usernameInput = page.locator('xpath=//input[@id="username"]');
    await expect(usernameInput).toBeVisible();
  });

  test('should use XPath text functions', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 XPath: text()
     * - //a[text()="exact text"]: Exact text match
     * - //a[contains(text(), "partial")]: Contains text
     * - //a[starts-with(text(), "start")]: Starts with
     * - //a[normalize-space()="text"]: Trim whitespace
     */
    const link = page.locator('xpath=//a[contains(text(), "Checkboxes")]');
    await expect(link).toBeVisible();
  });

  test('should use XPath axes for parent/sibling traversal', async ({ page }) => {
    await page.goto('/tables');

    /**
     * 📚 XPath Axes:
     * - ancestor::tag - Parent/grandparent elements
     * - parent::tag - Direct parent only
     * - following-sibling::tag - Next siblings
     * - preceding-sibling::tag - Previous siblings
     * - descendant::tag - All children (any depth)
     *
     * ⚠️ XPath parent traversal is powerful but hard to maintain.
     * Prefer CSS :has() or Playwright's filter() instead.
     */
    // Find the email cell for "Smith" using following-sibling
    const smithRow = page.locator(
      'xpath=//table[@id="table1"]//td[normalize-space()="Smith"]/following-sibling::td[2]'
    );
    await expect(smithRow).toBeVisible();
    const email = await smithRow.textContent();
    console.log(`Smith's email: ${email}`);
  });

  test('should use XPath with multiple conditions', async ({ page }) => {
    await page.goto('/challenging_dom');

    /**
     * 📚 XPath: Multiple conditions with 'and', 'or'
     * - //tag[@attr1="val1" and @attr2="val2"]
     * - //tag[@attr1="val1" or @attr2="val2"]
     * - //tag[not(@disabled)]
     */
    const button = page.locator('xpath=//a[contains(@class, "button") and contains(@class, "alert")]');
    await expect(button).toBeVisible();
  });
});
