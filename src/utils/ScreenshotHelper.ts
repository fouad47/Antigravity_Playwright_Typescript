/**
 * ============================================================
 * SCREENSHOT HELPER UTILITY
 * ============================================================
 *
 * 📚 LEARNING NOTE:
 * Centralizes screenshot capture logic for:
 * - On-failure screenshots
 * - On-pass screenshots
 * - Full-page screenshots
 * - Element-level screenshots
 * - Visual comparison baselines
 * ============================================================
 */

import { Page, Locator, TestInfo } from '@playwright/test';
import * as path from 'path';
import { FileHelper } from './FileHelper';

export class ScreenshotHelper {
  private readonly page: Page;
  private readonly screenshotsDir: string;

  constructor(page: Page) {
    this.page = page;
    this.screenshotsDir = path.resolve(process.cwd(), 'screenshots');
    FileHelper.ensureDirectory(this.screenshotsDir);
  }

  /**
   * Take a full-page screenshot with auto-generated name.
   */
  async captureFullPage(name: string): Promise<string> {
    const fileName = `${name}-${Date.now()}.png`;
    const filePath = path.join(this.screenshotsDir, fileName);
    await this.page.screenshot({
      path: filePath,
      fullPage: true,
    });
    console.log(`📸 Full page screenshot saved: ${filePath}`);
    return filePath;
  }

  /**
   * Take a viewport-only screenshot.
   */
  async captureViewport(name: string): Promise<string> {
    const fileName = `${name}-viewport-${Date.now()}.png`;
    const filePath = path.join(this.screenshotsDir, fileName);
    await this.page.screenshot({
      path: filePath,
      fullPage: false,
    });
    console.log(`📸 Viewport screenshot saved: ${filePath}`);
    return filePath;
  }

  /**
   * Take a screenshot of a specific element.
   */
  async captureElement(locator: Locator, name: string): Promise<string> {
    const fileName = `${name}-element-${Date.now()}.png`;
    const filePath = path.join(this.screenshotsDir, fileName);
    await locator.screenshot({ path: filePath });
    console.log(`📸 Element screenshot saved: ${filePath}`);
    return filePath;
  }

  /**
   * Capture screenshot on test failure.
   * Attach it to the Playwright test report.
   *
   * 📚 LEARNING NOTE:
   * TestInfo.attach() adds files to the test report.
   * This is the recommended way to save artifacts
   * that should be visible in the HTML report.
   */
  async captureOnFailure(testInfo: TestInfo, name?: string): Promise<void> {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotName = name || `failure-${testInfo.title.replace(/\s+/g, '-')}`;
      const screenshotPath = await this.captureFullPage(screenshotName);

      await testInfo.attach('screenshot-on-failure', {
        path: screenshotPath,
        contentType: 'image/png',
      });
      console.log(`📸 Failure screenshot attached to report`);
    }
  }

  /**
   * Capture screenshot regardless of test result.
   */
  async captureAlways(testInfo: TestInfo, name?: string): Promise<void> {
    const screenshotName = name || `result-${testInfo.title.replace(/\s+/g, '-')}`;
    const screenshotPath = await this.captureFullPage(screenshotName);

    await testInfo.attach('screenshot', {
      path: screenshotPath,
      contentType: 'image/png',
    });
  }
}
