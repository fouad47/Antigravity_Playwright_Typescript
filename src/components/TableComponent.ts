/**
 * ============================================================
 * TABLE COMPONENT - Reusable Component Object
 * ============================================================
 *
 * 📚 LEARNING NOTE:
 * This component can be used with ANY table on any page.
 * It receives a Locator to the table element and provides
 * generic table interaction methods.
 *
 * 🏗️ OOP - POLYMORPHISM:
 * The same TableComponent can work with different tables
 * because it operates on a generic Locator, not a specific one.
 * ============================================================
 */

import { Locator, expect } from '@playwright/test';

export class TableComponent {
  private readonly tableLocator: Locator;

  constructor(tableLocator: Locator) {
    this.tableLocator = tableLocator;
  }

  // ============================================================
  // DATA EXTRACTION
  // ============================================================

  /**
   * Get all header texts.
   */
  async getHeaders(): Promise<string[]> {
    return this.tableLocator.locator('thead th').allTextContents();
  }

  /**
   * Get the number of rows (excluding header).
   */
  async getRowCount(): Promise<number> {
    return this.tableLocator.locator('tbody tr').count();
  }

  /**
   * Get the number of columns.
   */
  async getColumnCount(): Promise<number> {
    return this.tableLocator.locator('thead th').count();
  }

  /**
   * Get all data from a specific row (0-based index).
   */
  async getRowData(rowIndex: number): Promise<string[]> {
    const cells = this.tableLocator.locator(`tbody tr:nth-child(${rowIndex + 1}) td`);
    return cells.allTextContents();
  }

  /**
   * Get all data from a specific column (0-based index).
   */
  async getColumnData(columnIndex: number): Promise<string[]> {
    const cells = this.tableLocator.locator(`tbody tr td:nth-child(${columnIndex + 1})`);
    return cells.allTextContents();
  }

  /**
   * Get a specific cell value.
   */
  async getCellValue(rowIndex: number, columnIndex: number): Promise<string> {
    const cell = this.tableLocator.locator(
      `tbody tr:nth-child(${rowIndex + 1}) td:nth-child(${columnIndex + 1})`
    );
    return (await cell.textContent()) || '';
  }

  /**
   * Get all table data as a 2D array.
   */
  async getAllData(): Promise<string[][]> {
    const rowCount = await this.getRowCount();
    const data: string[][] = [];

    for (let i = 0; i < rowCount; i++) {
      data.push(await this.getRowData(i));
    }
    return data;
  }

  // ============================================================
  // SEARCHING
  // ============================================================

  /**
   * Find the row index containing specific text in a column.
   */
  async findRowIndexByColumnValue(columnIndex: number, searchValue: string): Promise<number> {
    const columnData = await this.getColumnData(columnIndex);
    return columnData.findIndex((value) => value.trim() === searchValue);
  }

  /**
   * Click an action link/button in a specific row.
   */
  async clickActionInRow(rowIndex: number, actionText: string): Promise<void> {
    const row = this.tableLocator.locator(`tbody tr:nth-child(${rowIndex + 1})`);
    await row.locator(`a:text("${actionText}"), button:text("${actionText}")`).click();
  }

  // ============================================================
  // SORTING
  // ============================================================

  /**
   * Click a column header to sort the table.
   */
  async sortByColumn(columnName: string): Promise<void> {
    await this.tableLocator.locator(`th:has-text("${columnName}")`).click();
  }

  /**
   * Verify a column is sorted in ascending order.
   */
  async assertColumnSortedAscending(columnIndex: number): Promise<void> {
    const values = await this.getColumnData(columnIndex);
    const sorted = [...values].sort((a, b) => a.localeCompare(b));
    expect(values).toEqual(sorted);
  }

  /**
   * Verify a column is sorted in descending order.
   */
  async assertColumnSortedDescending(columnIndex: number): Promise<void> {
    const values = await this.getColumnData(columnIndex);
    const sorted = [...values].sort((a, b) => b.localeCompare(a));
    expect(values).toEqual(sorted);
  }
}
