/**
 * ============================================================
 * CHAPTER 04: FILE UPLOAD INTERACTIONS
 * ============================================================
 */

import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test.describe('File Upload', () => {

  test.beforeAll(() => {
    // Create a test file for uploading
    const testDir = path.resolve(process.cwd(), 'test-data');
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
    fs.writeFileSync(path.join(testDir, 'test-upload.txt'), 'Hello, Playwright!');
  });

  test('should upload a file via setInputFiles', async ({ page }) => {
    await page.goto('/upload');

    /**
     * 📚 setInputFiles()
     * Sets files on a file input element.
     * This is the RECOMMENDED way to handle file uploads.
     *
     * Options:
     * - Single file: setInputFiles('path/to/file')
     * - Multiple files: setInputFiles(['file1', 'file2'])
     * - Clear files: setInputFiles([])
     */
    const filePath = path.resolve(process.cwd(), 'test-data', 'test-upload.txt');
    
    await page.locator('#file-upload').setInputFiles(filePath);
    await page.locator('#file-submit').click();

    // Verify the file was uploaded
    await expect(page.locator('#uploaded-files')).toContainText('test-upload.txt');
  });

  test('should handle file chooser dialog', async ({ page }) => {
    await page.goto('/upload');

    /**
     * 📚 page.waitForEvent('filechooser')
     * Alternative approach: Listen for the file chooser dialog.
     * Use when setInputFiles doesn't work (e.g., custom upload buttons).
     */
    const filePath = path.resolve(process.cwd(), 'test-data', 'test-upload.txt');

    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator('#file-upload').click(),
    ]);

    await fileChooser.setFiles(filePath);
    await page.locator('#file-submit').click();

    await expect(page.locator('#uploaded-files')).toContainText('test-upload.txt');
  });

  test('should create and upload a dynamic file', async ({ page }) => {
    await page.goto('/upload');

    /**
     * 📚 Dynamic File Creation for Testing
     * Create files programmatically for upload testing.
     * Useful when test files need unique content.
     */
    const timestamp = Date.now();
    const dynamicFileName = `dynamic-test-${timestamp}.txt`;
    const dynamicContent = `Test file created at ${new Date().toISOString()}`;
    const filePath = path.resolve(process.cwd(), 'test-data', dynamicFileName);

    // Create the file
    fs.writeFileSync(filePath, dynamicContent);

    // Upload it
    await page.locator('#file-upload').setInputFiles(filePath);
    await page.locator('#file-submit').click();

    // Verify
    await expect(page.locator('#uploaded-files')).toContainText(dynamicFileName);

    // Cleanup
    fs.unlinkSync(filePath);
  });
});
