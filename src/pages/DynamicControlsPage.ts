/**
 * ============================================================
 * DYNAMIC CONTROLS PAGE - Page Object Model
 * ============================================================
 * URL: /dynamic_controls
 * Demonstrates: Waiting for dynamic elements, enable/disable states
 * ============================================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DynamicControlsPage extends BasePage {
  protected readonly path = '/dynamic_controls';

  private readonly headerText: Locator;
  private readonly checkbox: Locator;
  private readonly removeAddButton: Locator;
  private readonly enableDisableButton: Locator;
  private readonly textInput: Locator;
  private readonly message: Locator;
  private readonly loadingIndicator: Locator;
  private readonly checkboxExample: Locator;
  private readonly inputExample: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h4').first();
    this.checkbox = this.page.locator('#checkbox-example #checkbox, #checkbox-example input[type="checkbox"]');
    this.removeAddButton = this.page.locator('#checkbox-example button');
    this.enableDisableButton = this.page.locator('#input-example button');
    this.textInput = this.page.locator('#input-example input[type="text"]');
    this.message = this.page.locator('#message');
    this.loadingIndicator = this.page.locator('#loading');
    this.checkboxExample = this.page.locator('#checkbox-example');
    this.inputExample = this.page.locator('#input-example');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Click the Remove/Add button and wait for the operation to complete.
   */
  async clickRemoveAddButton(): Promise<void> {
    const buttonText = await this.removeAddButton.textContent();
    console.log(`🔘 Clicking: ${buttonText}`);
    await this.clickElement(this.removeAddButton, 'Remove/Add button');
    
    // Use section-specific loading indicator
    const indicator = this.checkboxExample.locator('#loading').first();
    await indicator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await indicator.waitFor({ state: 'hidden', timeout: 15000 });
  }

  /**
   * Click the Enable/Disable button and wait for the operation to complete.
   */
  async clickEnableDisableButton(): Promise<void> {
    const buttonText = await this.enableDisableButton.textContent();
    console.log(`🔘 Clicking: ${buttonText}`);
    await this.clickElement(this.enableDisableButton, 'Enable/Disable button');
    
    // Use section-specific loading indicator
    const indicator = this.inputExample.locator('#loading').first();
    await indicator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await indicator.waitFor({ state: 'hidden', timeout: 15000 });
  }

  /**
   * Type text into the input field.
   */
  async enterText(text: string): Promise<void> {
    await this.fillInput(this.textInput, text, 'text input');
  }

  // ============================================================
  // GETTERS
  // ============================================================

  async getMessage(): Promise<string> {
    return this.getElementText(this.message);
  }

  async isCheckboxPresent(): Promise<boolean> {
    return this.isElementVisible(this.checkbox);
  }

  async isTextInputEnabled(): Promise<boolean> {
    return this.isElementEnabled(this.textInput);
  }

  async isLoading(): Promise<boolean> {
    return this.isElementVisible(this.loadingIndicator);
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertCheckboxRemoved(): Promise<void> {
    await this.assertElementHidden(this.checkbox);
    await this.assertElementText(this.message, "It's gone!");
  }

  async assertCheckboxAdded(): Promise<void> {
    await this.assertElementVisible(this.checkbox);
    await this.assertElementText(this.message, "It's back!");
  }

  async assertInputEnabled(): Promise<void> {
    await expect(this.textInput).toBeEnabled();
    await this.assertElementText(this.message, "It's enabled!");
  }

  async assertInputDisabled(): Promise<void> {
    await expect(this.textInput).toBeDisabled();
    await this.assertElementText(this.message, "It's disabled!");
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Dynamic Controls');
  }
}
