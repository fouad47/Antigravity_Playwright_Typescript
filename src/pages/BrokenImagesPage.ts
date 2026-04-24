/**
 * ============================================================
 * BROKEN IMAGES PAGE - Page Object Model
 * ============================================================
 * URL: /broken_images
 * Demonstrates: Checking for broken images via naturalWidth
 * ============================================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BrokenImagesPage extends BasePage {
  protected readonly path = '/broken_images';

  private readonly headerText: Locator;
  private readonly images: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h3');
    this.images = this.page.locator('.example img');
  }

  // ============================================================
  // GETTERS
  // ============================================================

  async getImageCount(): Promise<number> {
    return this.images.count();
  }

  /**
   * Check if a specific image is broken.
   *
   * 📚 LEARNING NOTE:
   * A broken image has naturalWidth === 0.
   * We use page.evaluate() to access this DOM property.
   */
  async isImageBroken(index: number): Promise<boolean> {
    const image = this.images.nth(index);
    const naturalWidth = await image.evaluate(
      (img: HTMLImageElement) => img.naturalWidth
    );
    return naturalWidth === 0;
  }

  /**
   * Get all broken image indices.
   */
  async getBrokenImageIndices(): Promise<number[]> {
    const count = await this.getImageCount();
    const brokenIndices: number[] = [];

    for (let i = 0; i < count; i++) {
      if (await this.isImageBroken(i)) {
        brokenIndices.push(i);
      }
    }
    return brokenIndices;
  }

  /**
   * Get all image source URLs.
   */
  async getImageSources(): Promise<string[]> {
    const count = await this.getImageCount();
    const sources: string[] = [];

    for (let i = 0; i < count; i++) {
      const src = await this.images.nth(i).getAttribute('src');
      sources.push(src || '');
    }
    return sources;
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Broken Images');
  }

  async assertBrokenImagesExist(): Promise<void> {
    const brokenIndices = await this.getBrokenImageIndices();
    expect(brokenIndices.length).toBeGreaterThan(0);
  }
}
