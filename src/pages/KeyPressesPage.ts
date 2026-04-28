/**
 * ============================================================
 * KEY PRESSES PAGE - Page Object Model
 * ============================================================
 * URL: /key_presses
 * Demonstrates: Keyboard interactions and key events
 * ============================================================
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class KeyPressesPage extends BasePage {
  protected readonly path = '/key_presses';

  private readonly headerText: Locator;
  private readonly inputTarget: Locator;
  private readonly resultText: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h3');
    this.inputTarget = this.page.locator('#target');
    this.resultText = this.page.locator('#result');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Press a keyboard key and observe the result.
   */
  async pressKey(key: string): Promise<void> {
    console.log(`⌨️ Pressing key: ${key}`);
    await this.inputTarget.click({ force: true });
    await this.page.keyboard.press(key);
  }

  /**
   * Type text into the input (character by character).
   */
  async typeText(text: string): Promise<void> {
    console.log(`⌨️ Typing: "${text}"`);
    await this.inputTarget.pressSequentially(text);
  }

  /**
   * Focus the input target.
   */
  async focusInput(): Promise<void> {
    await this.inputTarget.focus();
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

  async assertKeyPressed(expectedKey: string): Promise<void> {
    await this.assertElementText(this.resultText, `You entered: ${expectedKey}`);
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Key Presses');
  }
}
