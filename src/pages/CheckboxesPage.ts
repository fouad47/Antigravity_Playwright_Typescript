/**
 * ============================================================
 * CHECKBOXES PAGE - Page Object Model
 * ============================================================
 * URL: /checkboxes
 * Demonstrates: Check/uncheck interactions, state verification
 * ============================================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckboxesPage extends BasePage {
  protected readonly path = '/checkboxes';

  // Locators
  private readonly headerText: Locator;
  private readonly checkboxes: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h3');
    this.checkboxes = this.page.locator('#checkboxes input[type="checkbox"]');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Get a specific checkbox by index (0-based).
   */
  getCheckbox(index: number): Locator {
    return this.checkboxes.nth(index);
  }

  /**
   * Check a specific checkbox by index.
   */
  async checkCheckbox(index: number): Promise<void> {
    console.log(`☑️ Checking checkbox ${index + 1}`);
    await this.getCheckbox(index).check();
  }

  /**
   * Uncheck a specific checkbox by index.
   */
  async uncheckCheckbox(index: number): Promise<void> {
    console.log(`⬜ Unchecking checkbox ${index + 1}`);
    await this.getCheckbox(index).uncheck();
  }

  /**
   * Toggle a checkbox (check if unchecked, uncheck if checked).
   */
  async toggleCheckbox(index: number): Promise<void> {
    const checkbox = this.getCheckbox(index);
    const isChecked = await checkbox.isChecked();
    console.log(`🔄 Toggling checkbox ${index + 1}: ${isChecked} → ${!isChecked}`);
    await checkbox.setChecked(!isChecked);
  }

  // ============================================================
  // GETTERS
  // ============================================================

  /**
   * Check if a specific checkbox is checked.
   */
  async isChecked(index: number): Promise<boolean> {
    return this.getCheckbox(index).isChecked();
  }

  /**
   * Get total number of checkboxes on the page.
   */
  async getCheckboxCount(): Promise<number> {
    return this.checkboxes.count();
  }

  /**
   * Get states of all checkboxes.
   */
  async getAllCheckboxStates(): Promise<boolean[]> {
    const count = await this.getCheckboxCount();
    const states: boolean[] = [];
    for (let i = 0; i < count; i++) {
      states.push(await this.isChecked(i));
    }
    return states;
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertCheckboxChecked(index: number): Promise<void> {
    await expect(this.getCheckbox(index)).toBeChecked();
  }

  async assertCheckboxUnchecked(index: number): Promise<void> {
    await expect(this.getCheckbox(index)).not.toBeChecked();
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Checkboxes');
  }
}
