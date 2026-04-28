/**
 * ============================================================
 * CHAPTER 10: WEB TABLES
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('Table Data Extraction', () => {

  test('should extract all table data', async ({ page }) => {
    await page.goto('/tables');

    const rows = page.locator('#table1 tbody tr');
    const rowCount = await rows.count();

    console.log(`\n📊 Table 1 Data (${rowCount} rows):`);
    console.log('─'.repeat(60));

    for (let i = 0; i < rowCount; i++) {
      const cells = rows.nth(i).locator('td');
      const cellCount = await cells.count();
      const rowData: string[] = [];
      for (let j = 0; j < cellCount; j++) {
        rowData.push((await cells.nth(j).textContent()) || '');
      }
      console.log(rowData.join(' | '));
    }

    expect(rowCount).toBe(4);
  });

  test('should verify table headers', async ({ page }) => {
    await page.goto('/tables');

    const headers = await page.locator('#table1 thead th').allTextContents();
    console.log('Headers:', headers);

    expect(headers).toContain('Last Name');
    expect(headers).toContain('First Name');
    expect(headers).toContain('Email');
    expect(headers).toContain('Due');
    expect(headers).toContain('Web Site');
    expect(headers).toContain('Action');
  });

  test('should find specific data in table', async ({ page }) => {
    await page.goto('/tables');

    // Find row containing "Smith" and get the email
    const smithRow = page.locator('#table1 tbody tr').filter({
      hasText: 'Smith',
    });
    const email = await smithRow.locator('td').nth(2).textContent();
    console.log(`Smith's email: ${email}`);
    expect(email).toContain('@');
  });

  test('should sort table by clicking column header', async ({ page }) => {
    await page.goto('/tables');

    // Click "Last Name" to sort
    await page.locator('#table1 th').filter({ hasText: 'Last Name' }).click();

    // Get sorted values
    const lastNames = await page.locator('#table1 tbody tr td:nth-child(1)').allTextContents();
    console.log('Sorted last names:', lastNames);

    // Verify ascending sort
    const sorted = [...lastNames].sort();
    expect(lastNames).toEqual(sorted);
  });

  test('should click action link in specific row', async ({ page }) => {
    await page.goto('/tables');

    // Find the row with "Smith" and click "edit"
    const smithRow = page.locator('#table1 tbody tr').filter({
      hasText: 'Smith',
    });
    await smithRow.locator('a:text("edit")').click();
    // Verify navigation or action (the-internet returns 404 for edit)
  });
});

test.describe('Dynamic Elements', () => {

  test('should handle add/remove elements', async ({ page }) => {
    await page.goto('/add_remove_elements/');

    // Add 3 elements
    const addButton = page.getByRole('button', { name: 'Add Element' });
    for (let i = 0; i < 3; i++) {
      await addButton.click();
    }

    // Verify 3 delete buttons appeared
    await expect(page.locator('.added-manually')).toHaveCount(3);

    // Remove one
    await page.locator('.added-manually').first().click();
    await expect(page.locator('.added-manually')).toHaveCount(2);
  });

  test('should detect broken images', async ({ page }) => {
    await page.goto('/broken_images');

    const images = page.locator('.example img');
    const count = await images.count();

    console.log(`\n🖼️ Checking ${count} images:`);
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate(
        (img: HTMLImageElement) => img.naturalWidth
      );
      const src = await images.nth(i).getAttribute('src');
      const isBroken = naturalWidth === 0;
      console.log(`  Image ${i + 1} (${src}): ${isBroken ? '❌ Broken' : '✅ OK'}`);
    }
  });

  test('should handle infinite scroll', async ({ page }) => {
    await page.goto('/infinite_scroll');

    // Get initial paragraph count
    const initialCount = await page.locator('.jscroll-added').count();
    console.log(`Initial paragraphs: ${initialCount}`);

    // Scroll down multiple times
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1500);
    }

    // Check more content loaded
    const newCount = await page.locator('.jscroll-added').count();
    console.log(`After scrolling: ${newCount} paragraphs`);
    expect(newCount).toBeGreaterThan(initialCount);
  });
});
