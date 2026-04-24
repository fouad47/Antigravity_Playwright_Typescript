/**
 * ============================================================
 * DRAG AND DROP PAGE - Page Object Model
 * ============================================================
 * URL: /drag_and_drop
 * Demonstrates: Drag and drop interactions
 * ============================================================
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DragAndDropPage extends BasePage {
  protected readonly path = '/drag_and_drop';

  private readonly headerText: Locator;
  private readonly columnA: Locator;
  private readonly columnB: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h3');
    this.columnA = this.page.locator('#column-a');
    this.columnB = this.page.locator('#column-b');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Drag column A to column B's position.
   *
   * 📚 LEARNING NOTE:
   * Playwright's dragTo() simulates HTML5 drag and drop.
   * For the-internet.herokuapp.com, we may need to use
   * JavaScript-based drag and drop as it uses a jQuery plugin.
   */
  async dragAToB(): Promise<void> {
    console.log('🔄 Dragging Column A to Column B');
    // Using JavaScript for reliable drag-and-drop on this specific page
    await this.page.evaluate(() => {
      const source = document.querySelector('#column-a') as HTMLElement;
      const target = document.querySelector('#column-b') as HTMLElement;
      
      const dataTransfer = new DataTransfer();
      
      source.dispatchEvent(new DragEvent('dragstart', { dataTransfer, bubbles: true }));
      target.dispatchEvent(new DragEvent('dragenter', { dataTransfer, bubbles: true }));
      target.dispatchEvent(new DragEvent('dragover', { dataTransfer, bubbles: true }));
      target.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true }));
      source.dispatchEvent(new DragEvent('dragend', { dataTransfer, bubbles: true }));
    });
  }

  /**
   * Drag column B to column A's position.
   */
  async dragBToA(): Promise<void> {
    console.log('🔄 Dragging Column B to Column A');
    await this.page.evaluate(() => {
      const source = document.querySelector('#column-b') as HTMLElement;
      const target = document.querySelector('#column-a') as HTMLElement;
      
      const dataTransfer = new DataTransfer();
      
      source.dispatchEvent(new DragEvent('dragstart', { dataTransfer, bubbles: true }));
      target.dispatchEvent(new DragEvent('dragenter', { dataTransfer, bubbles: true }));
      target.dispatchEvent(new DragEvent('dragover', { dataTransfer, bubbles: true }));
      target.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true }));
      source.dispatchEvent(new DragEvent('dragend', { dataTransfer, bubbles: true }));
    });
  }

  // ============================================================
  // GETTERS
  // ============================================================

  async getColumnAText(): Promise<string> {
    return this.getElementText(this.columnA);
  }

  async getColumnBText(): Promise<string> {
    return this.getElementText(this.columnB);
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertColumnOrder(firstColumn: string, secondColumn: string): Promise<void> {
    await this.assertElementText(this.columnA, firstColumn);
    await this.assertElementText(this.columnB, secondColumn);
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Drag and Drop');
  }
}
