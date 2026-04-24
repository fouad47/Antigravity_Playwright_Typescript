/**
 * ============================================================
 * ADD/REMOVE ELEMENTS PAGE - Page Object Model
 * ============================================================
 * URL: /add_remove_elements/
 * Demonstrates: Dynamic element creation and removal
 * ============================================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AddRemoveElementsPage extends BasePage {
  protected readonly path = '/add_remove_elements/';

  private readonly headerText: Locator;
  private readonly addButton: Locator;
  private readonly deleteButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h3');
    this.addButton = this.page.getByRole('button', { name: 'Add Element' });
    this.deleteButtons = this.page.locator('.added-manually');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  async addElement(): Promise<void> {
    console.log('➕ Adding element');
    await this.clickElement(this.addButton, 'Add Element button');
  }

  async addMultipleElements(count: number): Promise<void> {
    console.log(`➕ Adding ${count} elements`);
    for (let i = 0; i < count; i++) {
      await this.addElement();
    }
  }

  async removeLastElement(): Promise<void> {
    console.log('➖ Removing last element');
    await this.deleteButtons.last().click();
  }

  async removeElementByIndex(index: number): Promise<void> {
    console.log(`➖ Removing element at index ${index}`);
    await this.deleteButtons.nth(index).click();
  }

  async removeAllElements(): Promise<void> {
    const count = await this.getDeleteButtonCount();
    console.log(`➖ Removing all ${count} elements`);
    for (let i = count - 1; i >= 0; i--) {
      await this.deleteButtons.nth(i).click();
    }
  }

  // ============================================================
  // GETTERS
  // ============================================================

  async getDeleteButtonCount(): Promise<number> {
    return this.deleteButtons.count();
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertDeleteButtonCount(expectedCount: number): Promise<void> {
    await expect(this.deleteButtons).toHaveCount(expectedCount);
  }

  async assertNoDeleteButtons(): Promise<void> {
    await expect(this.deleteButtons).toHaveCount(0);
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Add/Remove Elements');
  }
}
