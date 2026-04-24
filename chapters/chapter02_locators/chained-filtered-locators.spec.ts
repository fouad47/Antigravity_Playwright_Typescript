/**
 * ============================================================
 * CHAPTER 02: CHAINED, FILTERED, AND ADVANCED LOCATORS
 * ============================================================
 *
 * 📚 LEARNING OBJECTIVES:
 * - Chain locators for precision
 * - Filter locators by text, has child, etc.
 * - Use nth() for index-based selection
 * - Use parent-child locator patterns
 * - Create dynamic locators
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('Chained Locators', () => {

  test('should chain locators to narrow down elements', async ({ page }) => {
    await page.goto('/tables');

    /**
     * 📚 Chained Locators
     * Use .locator() on an existing locator to search within it.
     * This narrows the search scope progressively.
     *
     * parent.locator(child) is equivalent to CSS: parent child
     */
    // Start from the table, then find rows, then cells
    const table = page.locator('#table1');
    const tbody = table.locator('tbody');
    const firstRow = tbody.locator('tr').first();
    const firstCell = firstRow.locator('td').first();

    const text = await firstCell.textContent();
    expect(text?.trim()).toBeTruthy();
    console.log(`First cell: ${text}`);
  });

  test('should chain multiple locator types', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 Mix Locator Types
     * You can chain any locator types together.
     * Example: CSS → role → text
     */
    const content = page.locator('#content');
    const links = content.getByRole('link');
    const count = await links.count();
    expect(count).toBeGreaterThan(10);
    console.log(`Found ${count} links in #content`);
  });
});

test.describe('Filter Locators', () => {

  test('should filter locators by text', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 locator.filter({ hasText: '...' })
     * Narrow down locators to only those containing specific text.
     * 
     * Options:
     * - hasText: string | RegExp - Must contain this text
     * - hasNotText: string | RegExp - Must NOT contain this text
     * - has: Locator - Must contain this child element
     * - hasNot: Locator - Must NOT contain this child element
     */
    const allLinks = page.locator('#content ul li');
    
    // Filter to only links containing "Dynamic"
    const dynamicLinks = allLinks.filter({ hasText: 'Dynamic' });
    const count = await dynamicLinks.count();
    expect(count).toBeGreaterThan(0);
    console.log(`Found ${count} items with "Dynamic" text`);
  });

  test('should filter locators by NOT having text', async ({ page }) => {
    await page.goto('/');

    const allLinks = page.locator('#content ul li a');
    const totalCount = await allLinks.count();

    // Filter out links containing "Dynamic"
    const nonDynamicLinks = allLinks.filter({ hasNotText: 'Dynamic' });
    const filteredCount = await nonDynamicLinks.count();

    expect(filteredCount).toBeLessThan(totalCount);
    console.log(`Total: ${totalCount}, Without "Dynamic": ${filteredCount}`);
  });

  test('should filter locators by child element', async ({ page }) => {
    await page.goto('/tables');

    /**
     * 📚 Filter by Child Element
     * filter({ has: locator }) keeps only parent elements
     * that contain the specified child element.
     */
    const rows = page.locator('#table1 tbody tr');

    // Find rows that contain an "edit" action link
    const editableRows = rows.filter({
      has: page.locator('a:text("edit")'),
    });
    const count = await editableRows.count();
    expect(count).toBeGreaterThan(0);
    console.log(`Found ${count} rows with edit links`);
  });
});

test.describe('Nth and Index Locators', () => {

  test('should select elements by index using nth()', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 locator.nth(index)
     * Select a specific element from a list of matches.
     * Index is 0-based.
     *
     * Related methods:
     * - .first() - Same as .nth(0)
     * - .last() - Last matching element
     * - .nth(n) - Element at index n
     */
    const links = page.locator('#content ul li a');

    const firstLink = links.first();
    const firstText = await firstLink.textContent();
    console.log(`First link: ${firstText}`);

    const thirdLink = links.nth(2);
    const thirdText = await thirdLink.textContent();
    console.log(`Third link: ${thirdText}`);

    const lastLink = links.last();
    const lastText = await lastLink.textContent();
    console.log(`Last link: ${lastText}`);

    // All should be visible
    await expect(firstLink).toBeVisible();
    await expect(thirdLink).toBeVisible();
    await expect(lastLink).toBeVisible();
  });

  test('should iterate over multiple elements', async ({ page }) => {
    await page.goto('/checkboxes');

    /**
     * 📚 Iterating Locators
     * Use .count() and .nth() to iterate over multiple elements.
     *
     * ⚠️ ANTI-PATTERN: Don't use .all() in production tests.
     * It returns a snapshot that can become stale.
     * Use count() + nth() for reliable iteration.
     */
    const checkboxes = page.locator('#checkboxes input[type="checkbox"]');
    const count = await checkboxes.count();

    console.log(`Found ${count} checkboxes:`);
    for (let i = 0; i < count; i++) {
      const isChecked = await checkboxes.nth(i).isChecked();
      console.log(`  Checkbox ${i + 1}: ${isChecked ? '✅ checked' : '⬜ unchecked'}`);
    }
  });
});

test.describe('Parent-Child Locator Patterns', () => {

  test('should find child from parent context', async ({ page }) => {
    await page.goto('/tables');

    /**
     * 📚 Parent → Child Pattern
     * Find a parent element first, then search within it.
     * This is the most common pattern for complex layouts.
     */
    // Find the row containing "Smith"
    const smithRow = page.locator('#table1 tbody tr', {
      has: page.locator('td:text("Smith")'),
    });

    // Get Smith's email (3rd column)
    const email = await smithRow.locator('td').nth(2).textContent();
    console.log(`Smith's email: ${email}`);
    expect(email).toBeTruthy();
  });

  test('should traverse up with locator chains and filters', async ({ page }) => {
    await page.goto('/tables');

    /**
     * 📚 Finding Parent from Child
     * Playwright doesn't have a direct "parent" locator.
     * Use filter({ has: ... }) to find a parent containing a child.
     *
     * Alternative: Use XPath ../.. for parent traversal.
     */
    // Find the row containing a specific email, then get the last name
    const rowWithEmail = page.locator('#table1 tbody tr').filter({
      hasText: 'jsmith@gmail.com',
    });
    
    const lastName = await rowWithEmail.locator('td').first().textContent();
    console.log(`Last name for jsmith@gmail.com: ${lastName}`);
  });
});

test.describe('Dynamic Locators', () => {

  test('should create dynamic locators with variables', async ({ page }) => {
    await page.goto('/');

    /**
     * 📚 Dynamic Locators
     * Use template literals to create locators with variables.
     * This is essential for data-driven testing.
     */
    const pageName = 'Checkboxes';
    const dynamicLink = page.getByRole('link', { name: pageName });
    await expect(dynamicLink).toBeVisible();

    // Navigate using dynamic locator
    await dynamicLink.click();
    await expect(page).toHaveURL(new RegExp(pageName.toLowerCase()));
  });

  test('should create parameterized locators', async ({ page }) => {
    await page.goto('/tables');

    /**
     * 📚 Parameterized Locator Function
     * Create helper functions that generate locators dynamically.
     * This is a key pattern in Page Object Model design.
     */
    const getTableCell = (row: number, col: number) =>
      page.locator(`#table1 tbody tr:nth-child(${row}) td:nth-child(${col})`);

    // Read specific cells
    const cell11 = await getTableCell(1, 1).textContent();
    const cell23 = await getTableCell(2, 3).textContent();

    console.log(`Cell [1,1]: ${cell11}`);
    console.log(`Cell [2,3]: ${cell23}`);

    expect(cell11).toBeTruthy();
    expect(cell23).toBeTruthy();
  });
});
