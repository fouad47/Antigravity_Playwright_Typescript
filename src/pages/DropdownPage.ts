/**
 * ============================================================
 * DROPDOWN PAGE - Page Object Model
 * ============================================================
 * URL: /dropdown
 * Demonstrates: selectOption, dropdown interactions
 * ============================================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DropdownPage extends BasePage {
  protected readonly path = '/dropdown';

  private readonly headerText: Locator;
  private readonly dropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h3');
    this.dropdown = this.page.locator('#dropdown');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Select an option by its visible text label.
   */
  async selectOptionByText(text: string): Promise<void> {
    await this.selectByText(this.dropdown, text, 'dropdown');
  }

  /**
   * Select an option by its value attribute.
   */
  async selectOptionByValue(value: string): Promise<void> {
    await this.selectByValue(this.dropdown, value, 'dropdown');
  }

  /**
   * Select an option by its index (0-based).
   */
  async selectOptionByIndex(index: number): Promise<void> {
    console.log(`📋 Selecting option at index ${index}`);
    await this.dropdown.selectOption({ index });
  }

  // ============================================================
  // GETTERS
  // ============================================================

  /**
   * Get the currently selected option's text.
   */
  async getSelectedOptionText(): Promise<string> {
    return this.page.locator('#dropdown option:checked').textContent() as Promise<string>;
  }

  /**
   * Get the currently selected option's value.
   */
  async getSelectedValue(): Promise<string> {
    return this.dropdown.inputValue();
  }

  /**
   * Get all available option texts.
   */
  async getAllOptionTexts(): Promise<string[]> {
    return this.page.locator('#dropdown option').allTextContents();
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertSelectedOption(expectedText: string): Promise<void> {
    const selected = await this.getSelectedOptionText();
    expect(selected?.trim()).toBe(expectedText);
  }

  async assertSelectedValue(expectedValue: string): Promise<void> {
    await expect(this.dropdown).toHaveValue(expectedValue);
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Dropdown List');
  }
}
