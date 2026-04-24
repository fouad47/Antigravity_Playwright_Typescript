/**
 * ============================================================
 * FRAMES PAGE - Page Object Model
 * ============================================================
 * URL: /frames, /nested_frames, /iframe
 * Demonstrates: Working with iframes and nested frames
 * ============================================================
 */

import { Page, Locator, FrameLocator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FramesPage extends BasePage {
  protected readonly path = '/frames';

  private readonly headerText: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h3');
  }

  // ============================================================
  // IFRAME METHODS
  // ============================================================

  /**
   * Navigate to the iFrame page.
   */
  async navigateToIFrame(): Promise<void> {
    await this.navigateToUrl('/iframe');
  }

  /**
   * Get the iFrame's FrameLocator.
   *
   * 📚 LEARNING NOTE:
   * FrameLocator represents an iframe on the page.
   * Use frameLocator() to switch context into an iframe.
   * All locators within the FrameLocator search inside the iframe.
   */
  getIFrameLocator(): FrameLocator {
    return this.page.frameLocator('#mce_0_ifr');
  }

  /**
   * Get text from the WYSIWYG editor inside the iframe.
   */
  async getIFrameEditorText(): Promise<string> {
    const body = this.getIFrameLocator().locator('#tinymce');
    return this.getElementText(body);
  }

  /**
   * Type text into the WYSIWYG editor inside the iframe.
   */
  async typeInIFrameEditor(text: string): Promise<void> {
    console.log(`⌨️ Typing in iframe editor: "${text}"`);
    const body = this.getIFrameLocator().locator('#tinymce');
    await body.fill(text);
  }

  /**
   * Clear and type in the iframe editor.
   */
  async clearAndTypeInIFrameEditor(text: string): Promise<void> {
    const body = this.getIFrameLocator().locator('#tinymce');
    await body.clear();
    await body.fill(text);
  }

  // ============================================================
  // NESTED FRAMES METHODS
  // ============================================================

  /**
   * Navigate to nested frames page.
   */
  async navigateToNestedFrames(): Promise<void> {
    await this.navigateToUrl('/nested_frames');
  }

  /**
   * Get text from the top-left frame in nested frames.
   *
   * 📚 LEARNING NOTE:
   * For nested frames, chain frameLocator() calls.
   * Each call goes one level deeper into the frame hierarchy.
   */
  async getTopLeftFrameText(): Promise<string> {
    const topFrame = this.page.frameLocator('frame[name="frame-top"]');
    const leftFrame = topFrame.frameLocator('frame[name="frame-left"]');
    const body = leftFrame.locator('body');
    return this.getElementText(body);
  }

  /**
   * Get text from the top-middle frame.
   */
  async getTopMiddleFrameText(): Promise<string> {
    const topFrame = this.page.frameLocator('frame[name="frame-top"]');
    const middleFrame = topFrame.frameLocator('frame[name="frame-middle"]');
    const body = middleFrame.locator('#content');
    return this.getElementText(body);
  }

  /**
   * Get text from the top-right frame.
   */
  async getTopRightFrameText(): Promise<string> {
    const topFrame = this.page.frameLocator('frame[name="frame-top"]');
    const rightFrame = topFrame.frameLocator('frame[name="frame-right"]');
    const body = rightFrame.locator('body');
    return this.getElementText(body);
  }

  /**
   * Get text from the bottom frame.
   */
  async getBottomFrameText(): Promise<string> {
    const bottomFrame = this.page.frameLocator('frame[name="frame-bottom"]');
    const body = bottomFrame.locator('body');
    return this.getElementText(body);
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Frames');
  }
}
