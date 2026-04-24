/**
 * ============================================================
 * STATUS CODES PAGE - Page Object Model
 * ============================================================
 * URL: /status_codes
 * Demonstrates: Verifying HTTP status codes
 * ============================================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class StatusCodesPage extends BasePage {
  protected readonly path = '/status_codes';

  private readonly headerText: Locator;
  private readonly statusLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h3');
    this.statusLinks = this.page.locator('ul li a');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Navigate to a specific status code page and capture the response.
   */
  async navigateToStatusCode(code: number): Promise<number> {
    console.log(`📡 Navigating to status code: ${code}`);
    const response = await this.page.goto(`/status_codes/${code}`);
    return response?.status() || 0;
  }

  /**
   * Click a status code link on the main page.
   */
  async clickStatusCodeLink(code: string): Promise<void> {
    await this.page.locator(`a:text("${code}")`).click();
  }

  // ============================================================
  // GETTERS
  // ============================================================

  async getAvailableStatusCodes(): Promise<string[]> {
    return this.statusLinks.allTextContents();
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertStatusCodePage(code: number): Promise<void> {
    await this.assertUrl(new RegExp(`/status_codes/${code}`));
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Status Codes');
  }
}
