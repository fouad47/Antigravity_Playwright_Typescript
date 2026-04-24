/**
 * ============================================================
 * MULTIPLE WINDOWS PAGE - Page Object Model
 * ============================================================
 * URL: /windows
 * Demonstrates: Handling new browser windows/tabs
 * ============================================================
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MultipleWindowsPage extends BasePage {
  protected readonly path = '/windows';

  private readonly headerText: Locator;
  private readonly clickHereLink: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h3');
    this.clickHereLink = this.page.getByRole('link', { name: 'Click Here' });
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Click the link and return the new page (new tab/window).
   *
   * 📚 LEARNING NOTE:
   * When a click opens a new tab, you need to:
   * 1. Listen for the 'popup' event BEFORE clicking
   * 2. The popup event resolves to the new Page object
   * 3. Wait for the new page to load
   * 4. Interact with the new page
   *
   * This is one of the most common interview questions!
   */
  async clickAndGetNewWindow(): Promise<Page> {
    console.log('🪟 Opening new window...');

    // Set up the popup listener BEFORE clicking
    const [newPage] = await Promise.all([
      this.context.waitForEvent('page'),
      this.clickElement(this.clickHereLink, 'Click Here link'),
    ]);

    // Wait for the new page to fully load
    await newPage.waitForLoadState('domcontentloaded');
    console.log(`🪟 New window opened: ${newPage.url()}`);

    return newPage;
  }

  // ============================================================
  // GETTERS
  // ============================================================

  /**
   * Get the header text of the current page.
   */
  async getHeaderText(): Promise<string> {
    return this.getElementText(this.headerText);
  }

  /**
   * Get new window's content text.
   */
  async getNewWindowText(newPage: Page): Promise<string> {
    const heading = newPage.locator('h3');
    return (await heading.textContent()) || '';
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Opening a new window');
  }
}
