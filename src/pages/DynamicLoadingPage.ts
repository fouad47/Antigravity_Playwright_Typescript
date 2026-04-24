/**
 * ============================================================
 * DYNAMIC LOADING PAGE - Page Object Model
 * ============================================================
 * URL: /dynamic_loading/1 and /dynamic_loading/2
 * Demonstrates: Waiting for dynamically loaded content
 * ============================================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DynamicLoadingPage extends BasePage {
  protected readonly path = '/dynamic_loading';

  private readonly startButton: Locator;
  private readonly loadingIndicator: Locator;
  private readonly finishText: Locator;
  private readonly headerText: Locator;

  constructor(page: Page) {
    super(page);
    this.startButton = this.page.locator('#start button');
    this.loadingIndicator = this.page.locator('#loading');
    this.finishText = this.page.locator('#finish h4');
    this.headerText = this.page.locator('h3');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Navigate to Example 1: Element hidden on page, made visible.
   */
  async navigateToExample1(): Promise<void> {
    console.log('📍 Navigating to Dynamic Loading Example 1');
    await this.navigateToUrl('/dynamic_loading/1');
  }

  /**
   * Navigate to Example 2: Element not on page, rendered after loading.
   */
  async navigateToExample2(): Promise<void> {
    console.log('📍 Navigating to Dynamic Loading Example 2');
    await this.navigateToUrl('/dynamic_loading/2');
  }

  /**
   * Click Start and wait for content to finish loading.
   */
  async startAndWaitForLoading(): Promise<void> {
    console.log('▶️ Starting dynamic loading...');
    await this.clickElement(this.startButton, 'Start button');
    await this.waitForElement(this.finishText, 15000);
  }

  /**
   * Click Start without waiting (for testing intermediate states).
   */
  async clickStart(): Promise<void> {
    await this.clickElement(this.startButton, 'Start button');
  }

  // ============================================================
  // GETTERS
  // ============================================================

  async getFinishText(): Promise<string> {
    return this.getElementText(this.finishText);
  }

  async isLoading(): Promise<boolean> {
    return this.isElementVisible(this.loadingIndicator);
  }

  async isFinishTextVisible(): Promise<boolean> {
    return this.isElementVisible(this.finishText);
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertFinishText(expectedText: string = 'Hello World!'): Promise<void> {
    await expect(this.finishText).toHaveText(expectedText);
  }

  async assertLoadingVisible(): Promise<void> {
    await this.assertElementVisible(this.loadingIndicator);
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Dynamically Loaded Page Elements');
  }
}
