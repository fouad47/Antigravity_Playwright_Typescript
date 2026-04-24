/**
 * ============================================================
 * NOTIFICATION MESSAGES PAGE - Page Object Model
 * ============================================================
 * URL: /notification_message_rendered
 * Demonstrates: Handling dynamic notification messages
 * ============================================================
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NotificationMessagesPage extends BasePage {
  protected readonly path = '/notification_message_rendered';

  private readonly headerText: Locator;
  private readonly clickHereLink: Locator;
  private readonly flashMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h3');
    this.clickHereLink = this.page.getByRole('link', { name: 'Click here' });
    this.flashMessage = this.page.locator('#flash');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  async clickToGetNotification(): Promise<void> {
    console.log('🔔 Clicking to trigger notification');
    await this.clickElement(this.clickHereLink, 'Click here link');
  }

  // ============================================================
  // GETTERS
  // ============================================================

  async getNotificationMessage(): Promise<string> {
    return this.getElementText(this.flashMessage);
  }

  async isNotificationVisible(): Promise<boolean> {
    return this.isElementVisible(this.flashMessage);
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertNotificationContains(text: string): Promise<void> {
    await this.assertElementText(this.flashMessage, text);
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Notification Message');
  }
}
