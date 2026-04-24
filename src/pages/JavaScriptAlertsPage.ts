/**
 * ============================================================
 * JAVASCRIPT ALERTS PAGE - Page Object Model
 * ============================================================
 * URL: /javascript_alerts
 * Demonstrates: Handling browser dialogs (alert, confirm, prompt)
 * ============================================================
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class JavaScriptAlertsPage extends BasePage {
  protected readonly path = '/javascript_alerts';

  private readonly headerText: Locator;
  private readonly jsAlertButton: Locator;
  private readonly jsConfirmButton: Locator;
  private readonly jsPromptButton: Locator;
  private readonly resultText: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h3');
    this.jsAlertButton = this.page.locator('button[onclick="jsAlert()"]');
    this.jsConfirmButton = this.page.locator('button[onclick="jsConfirm()"]');
    this.jsPromptButton = this.page.locator('button[onclick="jsPrompt()"]');
    this.resultText = this.page.locator('#result');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Trigger a JS Alert and accept it.
   *
   * 📚 LEARNING NOTE:
   * Playwright auto-dismisses dialogs by default.
   * To interact with them, set up a dialog handler BEFORE
   * triggering the action that opens the dialog.
   */
  async triggerAlertAndAccept(): Promise<string> {
    let alertText = '';
    this.page.once('dialog', async (dialog) => {
      console.log(`🔔 Alert text: ${dialog.message()}`);
      alertText = dialog.message();
      await dialog.accept();
    });
    await this.clickElement(this.jsAlertButton, 'JS Alert button');
    return alertText;
  }

  /**
   * Trigger a JS Confirm and accept it.
   */
  async triggerConfirmAndAccept(): Promise<string> {
    let confirmText = '';
    this.page.once('dialog', async (dialog) => {
      console.log(`🔔 Confirm text: ${dialog.message()}`);
      confirmText = dialog.message();
      await dialog.accept();
    });
    await this.clickElement(this.jsConfirmButton, 'JS Confirm button');
    return confirmText;
  }

  /**
   * Trigger a JS Confirm and dismiss (cancel) it.
   */
  async triggerConfirmAndDismiss(): Promise<string> {
    let confirmText = '';
    this.page.once('dialog', async (dialog) => {
      console.log(`🔔 Confirm text (dismissing): ${dialog.message()}`);
      confirmText = dialog.message();
      await dialog.dismiss();
    });
    await this.clickElement(this.jsConfirmButton, 'JS Confirm button');
    return confirmText;
  }

  /**
   * Trigger a JS Prompt and enter text.
   */
  async triggerPromptAndEnterText(text: string): Promise<string> {
    let promptText = '';
    this.page.once('dialog', async (dialog) => {
      console.log(`🔔 Prompt text: ${dialog.message()}`);
      promptText = dialog.message();
      await dialog.accept(text);
    });
    await this.clickElement(this.jsPromptButton, 'JS Prompt button');
    return promptText;
  }

  /**
   * Trigger a JS Prompt and dismiss it.
   */
  async triggerPromptAndDismiss(): Promise<string> {
    let promptText = '';
    this.page.once('dialog', async (dialog) => {
      promptText = dialog.message();
      await dialog.dismiss();
    });
    await this.clickElement(this.jsPromptButton, 'JS Prompt button');
    return promptText;
  }

  // ============================================================
  // GETTERS
  // ============================================================

  async getResultText(): Promise<string> {
    return this.getElementText(this.resultText);
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertResult(expectedText: string): Promise<void> {
    await this.assertElementText(this.resultText, expectedText);
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'JavaScript Alerts');
  }
}
