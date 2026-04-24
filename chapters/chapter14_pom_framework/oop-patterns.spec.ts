/**
 * ============================================================
 * CHAPTER 14: OOP PATTERNS IN TEST AUTOMATION
 * ============================================================
 *
 * 📚 This file demonstrates how OOP principles are applied
 * throughout our automation framework (not isolated examples).
 * ============================================================
 */

import { test, expect, Page } from '@playwright/test';
import { BasePage } from '../../src/pages/BasePage';
import { LoginPage } from '../../src/pages/LoginPage';
import { CheckboxesPage } from '../../src/pages/CheckboxesPage';
import { NavigationComponent } from '../../src/components/NavigationComponent';
import { TableComponent } from '../../src/components/TableComponent';
import { Logger } from '../../src/utils/Logger';

test.describe('OOP Principles in our Framework', () => {

  test('INHERITANCE - LoginPage extends BasePage', async ({ page }) => {
    /**
     * 📚 OOP - INHERITANCE
     *
     * LoginPage extends BasePage, inheriting:
     * - navigateTo(), goBack(), reload()
     * - clickElement(), fillInput()
     * - waitForElement(), waitForUrl()
     * - takeScreenshot()
     * - assertTitle(), assertUrl()
     *
     * LoginPage adds its own methods:
     * - login(), logout()
     * - assertLoginSuccess(), assertLoginFailure()
     *
     * This avoids code duplication across page objects.
     */
    const loginPage = new LoginPage(page);

    // Inherited method from BasePage
    await loginPage.navigateTo();

    // LoginPage-specific method
    await loginPage.login('tomsmith', 'SuperSecretPassword!');

    // Inherited assertion from BasePage
    await loginPage.assertUrl(/\/secure/);
  });

  test('ENCAPSULATION - Locators are private', async ({ page }) => {
    /**
     * 📚 OOP - ENCAPSULATION
     *
     * In our page objects:
     * - Locators are PRIVATE (can't be accessed from tests)
     * - Actions are PUBLIC (the interface for tests)
     * - Helpers are PROTECTED (available to subclasses)
     *
     * This means tests can't do: loginPage.usernameInput.fill()
     * They must use: loginPage.login(username, password)
     *
     * Benefits:
     * 1. If locators change, only the page object is updated
     * 2. Tests are more readable (business language)
     * 3. Prevents tests from depending on implementation details
     */
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();

    // ✅ Using public methods (correct)
    await loginPage.login('tomsmith', 'SuperSecretPassword!');

    // ❌ Can't access private locators (TypeScript prevents this):
    // loginPage.usernameInput.fill('test')  // Compile error!
  });

  test('POLYMORPHISM - TableComponent works with any table', async ({ page }) => {
    /**
     * 📚 OOP - POLYMORPHISM
     *
     * TableComponent accepts ANY table locator.
     * The same component class works with different tables
     * because it operates on the Locator interface, not a specific element.
     */
    await page.goto('/tables');

    // Same class, different tables
    const table1 = new TableComponent(page.locator('#table1'));
    const table2 = new TableComponent(page.locator('#table2'));

    // Same methods work on both
    const headers1 = await table1.getHeaders();
    const headers2 = await table2.getHeaders();

    console.log('Table 1 headers:', headers1);
    console.log('Table 2 headers:', headers2);

    const rows1 = await table1.getRowCount();
    const rows2 = await table2.getRowCount();

    expect(rows1).toBe(rows2); // Both tables have same data
  });

  test('ABSTRACTION - BasePage provides abstract contract', async ({ page }) => {
    /**
     * 📚 OOP - ABSTRACTION
     *
     * BasePage is abstract - it defines WHAT pages should do,
     * without specifying HOW each page does it.
     *
     * Every page MUST implement:
     * - path (abstract property for the URL)
     *
     * Every page CAN use:
     * - navigateTo() (uses the abstract path)
     * - All inherited methods
     *
     * You cannot create: new BasePage(page) // Error!
     * You must create: new LoginPage(page) // Concrete class
     */
    const loginPage = new LoginPage(page);
    const checkboxesPage = new CheckboxesPage(page);

    // Both use navigateTo() but go to different URLs
    // because each defines its own path
    await loginPage.navigateTo();
    await expect(page).toHaveURL(/\/login/);

    await checkboxesPage.navigateTo();
    await expect(page).toHaveURL(/\/checkboxes/);
  });

  test('COMPOSITION - NavigationComponent used across pages', async ({ page }) => {
    /**
     * 📚 OOP - COMPOSITION (over Inheritance)
     *
     * NavigationComponent is COMPOSED into page objects,
     * not inherited. This allows:
     * 1. Multiple components per page
     * 2. Components reused across unrelated pages
     * 3. Flexible, modular design
     *
     * Composition vs Inheritance:
     * - Inheritance: "is-a" (LoginPage IS-A page)
     * - Composition: "has-a" (LoginPage HAS-A navigation component)
     */
    const nav = new NavigationComponent(page);
    await page.goto('/');

    const examples = await nav.getAllExampleNames();
    console.log(`Found ${examples.length} examples via NavigationComponent`);
    expect(examples.length).toBeGreaterThan(10);
  });

  test('SINGLETON - Logger has single instance', async () => {
    /**
     * 📚 OOP - SINGLETON PATTERN
     *
     * Logger.getInstance() always returns the same instance.
     * This ensures all log output goes to one place.
     */
    const logger1 = Logger.getInstance();
    const logger2 = Logger.getInstance();

    // Both references point to the same object
    expect(logger1).toBe(logger2);

    logger1.info('This log goes to the singleton logger');
    logger2.info('Same logger instance!');
  });
});
