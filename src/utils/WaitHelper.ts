/**
 * ============================================================
 * WAIT HELPER UTILITY
 * ============================================================
 *
 * 📚 LEARNING NOTE:
 * Provides custom wait strategies beyond Playwright's auto-waiting.
 * Use these for complex scenarios where auto-waiting isn't enough.
 *
 * ⚠️ IMPORTANT: Always prefer Playwright's built-in auto-waiting.
 * Only use explicit waits when absolutely necessary.
 * ============================================================
 */

import { Page, Locator } from '@playwright/test';

export class WaitHelper {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for page to be fully loaded (DOM + network).
   */
  async waitForPageFullyLoaded(): Promise<void> {
    console.log('⏳ Waiting for page to be fully loaded...');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for a specific number of elements to be present.
   *
   * 📚 LEARNING NOTE:
   * Useful for pages that dynamically load elements.
   * Example: Wait for all table rows to render.
   */
  async waitForElementCount(locator: Locator, expectedCount: number, timeout: number = 10000): Promise<void> {
    console.log(`⏳ Waiting for ${expectedCount} elements...`);
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const count = await locator.count();
      if (count >= expectedCount) return;
      await this.page.waitForTimeout(200);
    }
    throw new Error(`Timed out waiting for ${expectedCount} elements. Found: ${await locator.count()}`);
  }

  /**
   * Wait for text content to change from a specific value.
   */
  async waitForTextChange(locator: Locator, originalText: string, timeout: number = 10000): Promise<void> {
    console.log(`⏳ Waiting for text to change from: "${originalText}"`);
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const currentText = await locator.textContent();
      if (currentText && currentText.trim() !== originalText) return;
      await this.page.waitForTimeout(200);
    }
    throw new Error(`Text did not change from "${originalText}" within ${timeout}ms`);
  }

  /**
   * Wait for a network request matching a URL pattern.
   */
  async waitForRequest(urlPattern: string | RegExp): Promise<void> {
    console.log(`⏳ Waiting for network request: ${urlPattern}`);
    await this.page.waitForRequest(urlPattern);
  }

  /**
   * Wait for a network response matching a URL pattern.
   */
  async waitForResponse(urlPattern: string | RegExp): Promise<void> {
    console.log(`⏳ Waiting for network response: ${urlPattern}`);
    await this.page.waitForResponse(urlPattern);
  }

  /**
   * Retry an action until it succeeds or times out.
   *
   * 📚 LEARNING NOTE:
   * This is a polling-based retry pattern. Useful when:
   * - An action might fail due to timing
   * - You need to retry an assertion
   * - Dynamic content hasn't loaded yet
   */
  async retryAction<T>(
    action: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries}`);
        return await action();
      } catch (error) {
        lastError = error as Error;
        console.warn(`⚠️ Attempt ${attempt} failed: ${lastError.message}`);
        if (attempt < maxRetries) {
          await this.page.waitForTimeout(delayMs);
        }
      }
    }

    throw new Error(`Action failed after ${maxRetries} retries. Last error: ${lastError?.message}`);
  }

  /**
   * Wait for a condition to be true.
   */
  async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 10000,
    pollInterval: number = 200,
    description: string = 'condition'
  ): Promise<void> {
    console.log(`⏳ Waiting for ${description}...`);
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (await condition()) return;
      await this.page.waitForTimeout(pollInterval);
    }
    throw new Error(`Timed out waiting for ${description} after ${timeout}ms`);
  }
}
