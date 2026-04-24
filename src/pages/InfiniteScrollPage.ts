/**
 * ============================================================
 * INFINITE SCROLL PAGE - Page Object Model
 * ============================================================
 * URL: /infinite_scroll
 * Demonstrates: Scroll actions and dynamic content loading
 * ============================================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InfiniteScrollPage extends BasePage {
  protected readonly path = '/infinite_scroll';

  private readonly headerText: Locator;
  private readonly paragraphs: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h3');
    this.paragraphs = this.page.locator('.jscroll-added');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Scroll down to trigger infinite scroll loading.
   *
   * 📚 LEARNING NOTE:
   * Infinite scroll pages load content as you scroll.
   * To test this, we scroll to the bottom and wait for
   * new content to appear.
   */
  async scrollToLoadMore(): Promise<void> {
    console.log('📜 Scrolling to load more content...');
    await this.scrollToBottom();
    // Give time for new content to load
    await this.page.waitForTimeout(1000);
  }

  /**
   * Scroll multiple times to load several batches of content.
   */
  async scrollMultipleTimes(times: number): Promise<void> {
    console.log(`📜 Scrolling ${times} times...`);
    for (let i = 0; i < times; i++) {
      await this.scrollToLoadMore();
    }
  }

  // ============================================================
  // GETTERS
  // ============================================================

  async getParagraphCount(): Promise<number> {
    return this.paragraphs.count();
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertMoreContentLoaded(initialCount: number): Promise<void> {
    const currentCount = await this.getParagraphCount();
    expect(currentCount).toBeGreaterThan(initialCount);
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Infinite Scroll');
  }
}
