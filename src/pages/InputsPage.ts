/**
 * ============================================================
 * INPUTS PAGE - Page Object Model
 * ============================================================
 * URL: /inputs
 * Demonstrates: Number input interactions
 * ============================================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InputsPage extends BasePage {
  protected readonly path = '/inputs';

  private readonly headerText: Locator;
  private readonly numberInput: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h3');
    this.numberInput = this.page.locator('input[type="number"]');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  async enterNumber(value: string): Promise<void> {
    console.log(`🔢 Entering number: ${value}`);
    await this.fillInput(this.numberInput, value, 'number input');
  }

  async incrementWithArrowUp(times: number = 1): Promise<void> {
    console.log(`⬆️ Pressing arrow up ${times} times`);
    await this.numberInput.click();
    for (let i = 0; i < times; i++) {
      await this.numberInput.press('ArrowUp');
    }
  }

  async decrementWithArrowDown(times: number = 1): Promise<void> {
    console.log(`⬇️ Pressing arrow down ${times} times`);
    await this.numberInput.click();
    for (let i = 0; i < times; i++) {
      await this.numberInput.press('ArrowDown');
    }
  }

  async clearInput(): Promise<void> {
    await this.numberInput.clear();
  }

  // ============================================================
  // GETTERS
  // ============================================================

  async getInputValue(): Promise<string> {
    return this.numberInput.inputValue();
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertInputValue(expectedValue: string): Promise<void> {
    await expect(this.numberInput).toHaveValue(expectedValue);
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Inputs');
  }
}
