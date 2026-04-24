/**
 * ============================================================
 * CHALLENGING DOM PAGE - Page Object Model
 * ============================================================
 * URL: /challenging_dom
 * Demonstrates: Working with dynamically generated elements
 * ============================================================
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ChallengingDOMPage extends BasePage {
  protected readonly path = '/challenging_dom';

  private readonly headerText: Locator;
  private readonly buttons: Locator;
  private readonly table: Locator;
  private readonly canvas: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h3');
    this.buttons = this.page.locator('.large-2.columns a.button');
    this.table = this.page.locator('table');
    this.canvas = this.page.locator('#canvas');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  async clickButton(index: number): Promise<void> {
    console.log(`🔘 Clicking button at index ${index}`);
    await this.buttons.nth(index).click();
  }

  async clickBlueButton(): Promise<void> {
    console.log('🔘 Clicking blue button');
    await this.page.locator('a.button:not(.alert):not(.success)').click();
  }

  async clickRedButton(): Promise<void> {
    console.log('🔘 Clicking red/alert button');
    await this.page.locator('a.button.alert').click();
  }

  async clickGreenButton(): Promise<void> {
    console.log('🔘 Clicking green/success button');
    await this.page.locator('a.button.success').click();
  }

  // ============================================================
  // GETTERS
  // ============================================================

  async getTableData(): Promise<string[][]> {
    const rows = this.table.locator('tbody tr');
    const rowCount = await rows.count();
    const data: string[][] = [];

    for (let i = 0; i < rowCount; i++) {
      const cells = rows.nth(i).locator('td');
      const cellCount = await cells.count();
      const rowData: string[] = [];
      for (let j = 0; j < cellCount; j++) {
        rowData.push((await cells.nth(j).textContent()) || '');
      }
      data.push(rowData);
    }
    return data;
  }

  async getButtonCount(): Promise<number> {
    return this.buttons.count();
  }

  async isCanvasPresent(): Promise<boolean> {
    return this.isElementVisible(this.canvas);
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Challenging DOM');
  }
}
