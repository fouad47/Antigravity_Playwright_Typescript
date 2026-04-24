/**
 * ============================================================
 * CHAPTER 09: JAVASCRIPT ALERTS
 * ============================================================
 *
 * 📚 Playwright auto-dismisses dialogs by default.
 * To interact with them, register a 'dialog' event handler
 * BEFORE triggering the dialog action.
 * ============================================================
 */

import { test, expect } from '@playwright/test';

test.describe('JavaScript Alert', () => {

  test('should handle JS Alert - accept', async ({ page }) => {
    await page.goto('/javascript_alerts');

    /**
     * 📚 page.on('dialog') / page.once('dialog')
     * Register handler for dialogs.
     * - once() handles one dialog then auto-removes
     * - on() handles ALL subsequent dialogs
     */
    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('I am a JS Alert');
      console.log(`Alert message: ${dialog.message()}`);
      await dialog.accept();
    });

    await page.locator('button[onclick="jsAlert()"]').click();
    await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
  });
});

test.describe('JavaScript Confirm', () => {

  test('should handle JS Confirm - accept (OK)', async ({ page }) => {
    await page.goto('/javascript_alerts');

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('I am a JS Confirm');
      await dialog.accept(); // Click OK
    });

    await page.locator('button[onclick="jsConfirm()"]').click();
    await expect(page.locator('#result')).toHaveText('You clicked: Ok');
  });

  test('should handle JS Confirm - dismiss (Cancel)', async ({ page }) => {
    await page.goto('/javascript_alerts');

    page.once('dialog', async (dialog) => {
      await dialog.dismiss(); // Click Cancel
    });

    await page.locator('button[onclick="jsConfirm()"]').click();
    await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
  });
});

test.describe('JavaScript Prompt', () => {

  test('should handle JS Prompt - enter text', async ({ page }) => {
    await page.goto('/javascript_alerts');

    const inputText = 'Hello from Playwright!';

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toBe('I am a JS prompt');
      await dialog.accept(inputText); // Enter text and click OK
    });

    await page.locator('button[onclick="jsPrompt()"]').click();
    await expect(page.locator('#result')).toHaveText(`You entered: ${inputText}`);
  });

  test('should handle JS Prompt - dismiss without text', async ({ page }) => {
    await page.goto('/javascript_alerts');

    page.once('dialog', async (dialog) => {
      await dialog.dismiss(); // Click Cancel without entering text
    });

    await page.locator('button[onclick="jsPrompt()"]').click();
    await expect(page.locator('#result')).toHaveText('You entered: null');
  });
});

test.describe('File Download', () => {

  test('should handle file download', async ({ page }) => {
    await page.goto('/download');

    /**
     * 📚 Handling File Downloads
     * Listen for 'download' event before clicking.
     * The Download object provides methods to get the file.
     */
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('a[href*=".txt"]').first().click(),
    ]);

    // Get the download file name
    const fileName = download.suggestedFilename();
    console.log(`Downloaded: ${fileName}`);

    // Save to a specific path
    const savePath = `test-data/downloads/${fileName}`;
    await download.saveAs(savePath);

    // Verify the download
    expect(fileName).toBeTruthy();
  });
});
