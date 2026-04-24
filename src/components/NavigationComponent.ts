/**
 * ============================================================
 * NAVIGATION COMPONENT - Reusable Component Object
 * ============================================================
 *
 * 📚 LEARNING NOTES:
 * Component Objects represent reusable UI components that appear
 * on multiple pages. Unlike Page Objects (one per page),
 * Component Objects can be composed into any page.
 *
 * 🏗️ OOP - COMPOSITION over Inheritance:
 * Instead of making every page inherit navigation methods,
 * we create a separate NavigationComponent that pages can USE.
 * This is the "Composition over Inheritance" principle.
 * ============================================================
 */

import { Page, Locator, expect } from '@playwright/test';

export class NavigationComponent {
  private readonly page: Page;
  private readonly headerLink: Locator;
  private readonly footerLink: Locator;
  private readonly availableExamples: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerLink = this.page.locator('h1 a');
    this.footerLink = this.page.locator('#page-footer a');
    this.availableExamples = this.page.locator('#content ul li a');
  }

  /**
   * Navigate to the home page via the header link.
   */
  async goToHomePage(): Promise<void> {
    console.log('🏠 Navigating to home page');
    await this.headerLink.click();
  }

  /**
   * Get the footer attribution text.
   */
  async getFooterText(): Promise<string> {
    const footer = this.page.locator('#page-footer');
    return (await footer.textContent()) || '';
  }

  /**
   * Click on a specific example link from the home page.
   */
  async navigateToExample(exampleName: string): Promise<void> {
    console.log(`📍 Navigating to example: ${exampleName}`);
    await this.page.locator(`#content ul li a:text("${exampleName}")`).click();
  }

  /**
   * Get all available example names from the home page.
   */
  async getAllExampleNames(): Promise<string[]> {
    return this.availableExamples.allTextContents();
  }

  /**
   * Assert the header link is visible.
   */
  async assertHeaderVisible(): Promise<void> {
    await expect(this.headerLink).toBeVisible();
  }
}
