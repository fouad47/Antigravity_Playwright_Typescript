/**
 * ============================================================
 * HOVERS PAGE - Page Object Model
 * ============================================================
 * URL: /hovers
 * Demonstrates: Mouse hover interactions, dynamic content visibility
 * ============================================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HoversPage extends BasePage {
  protected readonly path = '/hovers';

  private readonly headerText: Locator;
  private readonly figures: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h3');
    this.figures = this.page.locator('.figure');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Hover over a specific user avatar (0-based index).
   */
  async hoverOverUser(index: number): Promise<void> {
    const figure = this.figures.nth(index);
    await this.hoverElement(figure, `user ${index + 1}`);
  }

  /**
   * Click "View profile" link for a specific user after hovering.
   */
  async viewProfile(index: number): Promise<void> {
    await this.hoverOverUser(index);
    const profileLink = this.figures.nth(index).locator('a');
    await this.clickElement(profileLink, `user ${index + 1} profile link`);
  }

  // ============================================================
  // GETTERS
  // ============================================================

  /**
   * Get the username displayed on hover.
   */
  async getUsernameOnHover(index: number): Promise<string> {
    await this.hoverOverUser(index);
    const caption = this.figures.nth(index).locator('.figcaption h5');
    return this.getElementText(caption);
  }

  /**
   * Check if user info is visible (appears on hover).
   */
  async isUserInfoVisible(index: number): Promise<boolean> {
    const caption = this.figures.nth(index).locator('.figcaption');
    return this.isElementVisible(caption);
  }

  /**
   * Get total number of user figures.
   */
  async getUserCount(): Promise<number> {
    return this.figures.count();
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertUsernameDisplayed(index: number, expectedName: string): Promise<void> {
    await this.hoverOverUser(index);
    const caption = this.figures.nth(index).locator('.figcaption h5');
    await this.assertElementText(caption, expectedName);
  }

  async assertUserInfoVisibleOnHover(index: number): Promise<void> {
    await this.hoverOverUser(index);
    const caption = this.figures.nth(index).locator('.figcaption');
    await this.assertElementVisible(caption);
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Hovers');
  }
}
