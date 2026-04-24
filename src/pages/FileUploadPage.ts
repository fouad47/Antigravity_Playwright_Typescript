/**
 * ============================================================
 * FILE UPLOAD PAGE - Page Object Model
 * ============================================================
 * URL: /upload
 * Demonstrates: File upload interactions
 * ============================================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class FileUploadPage extends BasePage {
  protected readonly path = '/upload';

  private readonly fileInput: Locator;
  private readonly uploadButton: Locator;
  private readonly uploadedFileName: Locator;
  private readonly dragDropArea: Locator;
  private readonly headerText: Locator;

  constructor(page: Page) {
    super(page);
    this.fileInput = this.page.locator('#file-upload');
    this.uploadButton = this.page.locator('#file-submit');
    this.uploadedFileName = this.page.locator('#uploaded-files');
    this.dragDropArea = this.page.locator('#drag-drop-upload');
    this.headerText = this.page.locator('h3');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Upload a file using the file input.
   */
  async uploadFileByPath(filePath: string): Promise<void> {
    await this.uploadFile(this.fileInput, filePath);
    await this.clickElement(this.uploadButton, 'Upload button');
  }

  /**
   * Set file without clicking upload (for partial testing).
   */
  async selectFile(filePath: string): Promise<void> {
    await this.uploadFile(this.fileInput, filePath);
  }

  /**
   * Click upload button.
   */
  async clickUpload(): Promise<void> {
    await this.clickElement(this.uploadButton, 'Upload button');
  }

  // ============================================================
  // GETTERS
  // ============================================================

  async getUploadedFileName(): Promise<string> {
    return this.getElementText(this.uploadedFileName);
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertFileUploaded(fileName: string): Promise<void> {
    await this.assertElementText(this.uploadedFileName, fileName);
  }

  async assertUploadPageDisplayed(): Promise<void> {
    await this.assertElementText(this.headerText, 'File Uploader');
    await this.assertElementVisible(this.fileInput);
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'File Uploader');
  }
}
