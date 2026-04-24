/**
 * ============================================================
 * TABLES PAGE - Page Object Model (Sortable Data Tables)
 * ============================================================
 * URL: /tables
 * Demonstrates: Web table interactions, data extraction, sorting
 * ============================================================
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Interface representing a row in the data table.
 * 📚 TypeScript BEST PRACTICE: Define interfaces for structured data.
 */
export interface TableRow {
  lastName: string;
  firstName: string;
  email: string;
  due: string;
  website: string;
}

export class TablesPage extends BasePage {
  protected readonly path = '/tables';

  private readonly headerText: Locator;
  private readonly table1: Locator;
  private readonly table2: Locator;

  constructor(page: Page) {
    super(page);
    this.headerText = this.page.locator('h3');
    this.table1 = this.page.locator('#table1');
    this.table2 = this.page.locator('#table2');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Sort table 1 by clicking a column header.
   */
  async sortTable1ByColumn(columnName: string): Promise<void> {
    console.log(`📊 Sorting table 1 by: ${columnName}`);
    await this.table1.locator(`th span:text("${columnName}")`).click();
  }

  /**
   * Sort table 2 by clicking a column header.
   */
  async sortTable2ByColumn(columnName: string): Promise<void> {
    console.log(`📊 Sorting table 2 by: ${columnName}`);
    await this.table2.locator(`th span:text("${columnName}")`).click();
  }

  // ============================================================
  // GETTERS
  // ============================================================

  /**
   * Get all rows from Table 1 as structured data.
   *
   * 📚 LEARNING NOTE:
   * Extracting structured data from tables is a common
   * automation task. Use interfaces for type safety.
   */
  async getTable1Data(): Promise<TableRow[]> {
    const rows = this.table1.locator('tbody tr');
    const count = await rows.count();
    const data: TableRow[] = [];

    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).locator('td');
      data.push({
        lastName: (await cells.nth(0).textContent()) || '',
        firstName: (await cells.nth(1).textContent()) || '',
        email: (await cells.nth(2).textContent()) || '',
        due: (await cells.nth(3).textContent()) || '',
        website: (await cells.nth(4).textContent()) || '',
      });
    }
    return data;
  }

  /**
   * Get all rows from Table 2 as structured data.
   */
  async getTable2Data(): Promise<TableRow[]> {
    const rows = this.table2.locator('tbody tr');
    const count = await rows.count();
    const data: TableRow[] = [];

    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).locator('td');
      data.push({
        lastName: (await cells.nth(0).textContent()) || '',
        firstName: (await cells.nth(1).textContent()) || '',
        email: (await cells.nth(2).textContent()) || '',
        due: (await cells.nth(3).textContent()) || '',
        website: (await cells.nth(4).textContent()) || '',
      });
    }
    return data;
  }

  /**
   * Get a specific cell value from Table 1.
   * @param row - Row index (0-based)
   * @param column - Column index (0-based)
   */
  async getTable1CellValue(row: number, column: number): Promise<string> {
    const cell = this.table1.locator(`tbody tr:nth-child(${row + 1}) td:nth-child(${column + 1})`);
    return this.getElementText(cell);
  }

  /**
   * Get row count from Table 1.
   */
  async getTable1RowCount(): Promise<number> {
    return this.table1.locator('tbody tr').count();
  }

  /**
   * Get column values from Table 1.
   */
  async getTable1ColumnValues(columnIndex: number): Promise<string[]> {
    const cells = this.table1.locator(`tbody tr td:nth-child(${columnIndex + 1})`);
    return cells.allTextContents();
  }

  /**
   * Find a row by last name in Table 1.
   */
  async findRowByLastName(lastName: string): Promise<TableRow | null> {
    const data = await this.getTable1Data();
    return data.find((row) => row.lastName === lastName) || null;
  }

  // ============================================================
  // ASSERTIONS
  // ============================================================

  async assertTable1HasRows(expectedCount: number): Promise<void> {
    const count = await this.getTable1RowCount();
    expect(count).toBe(expectedCount);
  }

  async assertTable1ColumnSorted(columnIndex: number, ascending: boolean = true): Promise<void> {
    const values = await this.getTable1ColumnValues(columnIndex);
    const sorted = [...values].sort((a, b) =>
      ascending ? a.localeCompare(b) : b.localeCompare(a)
    );
    expect(values).toEqual(sorted);
  }

  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Data Tables');
  }
}
