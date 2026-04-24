/**
 * ============================================================
 * FILE HELPER UTILITY
 * ============================================================
 *
 * 📚 LEARNING NOTE:
 * Handles file operations needed for testing:
 * - Creating test files for upload
 * - Reading downloaded files
 * - Managing test artifacts (screenshots, logs)
 * ============================================================
 */

import * as fs from 'fs';
import * as path from 'path';

export class FileHelper {
  /**
   * Create a temporary text file for upload testing.
   */
  static createTestFile(
    fileName: string,
    content: string = 'Test file content',
    directory: string = 'test-data'
  ): string {
    const dirPath = path.resolve(process.cwd(), directory);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const filePath = path.join(dirPath, fileName);
    fs.writeFileSync(filePath, content);
    console.log(`📁 Created test file: ${filePath}`);
    return filePath;
  }

  /**
   * Read a file's content.
   */
  static readFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Check if a file exists.
   */
  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Delete a file.
   */
  static deleteFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted file: ${filePath}`);
    }
  }

  /**
   * Create a directory if it doesn't exist.
   */
  static ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Get all files in a directory.
   */
  static getFilesInDirectory(dirPath: string): string[] {
    if (!fs.existsSync(dirPath)) return [];
    return fs.readdirSync(dirPath);
  }

  /**
   * Get file size in bytes.
   */
  static getFileSize(filePath: string): number {
    if (!fs.existsSync(filePath)) return 0;
    return fs.statSync(filePath).size;
  }

  /**
   * Wait for a file to exist (useful for downloads).
   */
  static async waitForFile(filePath: string, timeoutMs: number = 10000): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (fs.existsSync(filePath)) return true;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    return false;
  }

  /**
   * Clean up a directory by removing all files.
   */
  static cleanDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isFile()) {
        fs.unlinkSync(fullPath);
      }
    }
    console.log(`🧹 Cleaned directory: ${dirPath}`);
  }
}
