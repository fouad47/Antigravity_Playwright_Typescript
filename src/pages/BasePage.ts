/**
 * ============================================================
 * BASE PAGE - Foundation of the Page Object Model
 * ============================================================
 *
 * 📚 LEARNING NOTES:
 * The BasePage class is the parent of ALL page objects.
 * It contains common functionality shared across pages:
 * - Navigation helpers
 * - Common element interactions
 * - Waiting utilities
 * - Screenshot helpers
 * - Logging helpers
 *
 * 🏗️ OOP CONCEPTS DEMONSTRATED:
 * - Abstraction: BasePage defines the blueprint for all pages
 * - Encapsulation: Page object wraps Playwright internals
 * - Inheritance: All page classes extend BasePage
 *
 * 💡 BEST PRACTICE:
 * - Keep BasePage focused on truly universal functionality
 * - Don't add page-specific methods here
 * - Use protected access for methods subclasses need
 * - Use private for internal implementation details
 * ============================================================
 */

import { Page, Locator, expect, BrowserContext } from '@playwright/test';

/**
 * Abstract base class for all Page Objects.
 *
 * 📚 OOP - ABSTRACTION:
 * An abstract class cannot be instantiated directly.
 * It serves as a contract that all child classes must follow.
 * The 'abstract' keyword in TypeScript enforces this pattern.
 */
export abstract class BasePage {
  // ============================================================
  // PROPERTIES
  // ============================================================

  /**
   * 📚 OOP - ENCAPSULATION:
   * 'protected' means only this class and its children can access 'page'.
   * External code must use the public methods we provide.
   * This hides implementation details and prevents misuse.
   */
  protected readonly page: Page;
  protected readonly context: BrowserContext;

  /**
   * Each page must define its own URL path.
   *
   * 📚 OOP - ABSTRACTION:
   * Abstract properties force every page object to declare its path.
   * This is enforced at compile time by TypeScript.
   */
  protected abstract readonly path: string;

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  /**
   * @param page - Playwright Page object
   *
   * 📚 LEARNING NOTE:
   * The constructor receives the Playwright Page instance.
   * This is dependency injection - the page object doesn't
   * create the Page, it receives it from outside.
   */
  constructor(page: Page) {
    this.page = page;
    this.context = page.context();
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  /**
   * Navigate to this page's URL path.
   * Uses baseURL from playwright.config.ts automatically.
   *
   * @example
   * const loginPage = new LoginPage(page);
   * await loginPage.navigateTo(); // Goes to baseURL + '/login'
   */
  async navigateTo(): Promise<void> {
    console.log(`📍 Navigating to: ${this.path}`);
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Navigate to any URL (absolute or relative).
   */
  async navigateToUrl(url: string): Promise<void> {
    console.log(`📍 Navigating to URL: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Get the current page URL.
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get the current page title.
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Go back in browser history.
   */
  async goBack(): Promise<void> {
    console.log('⬅️ Navigating back');
    await this.page.goBack();
  }

  /**
   * Reload the current page.
   */
  async reload(): Promise<void> {
    console.log('🔄 Reloading page');
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  // ============================================================
  // COMMON ELEMENT INTERACTIONS
  // ============================================================

  /**
   * Click an element with logging.
   *
   * @param locator - Playwright Locator
   * @param description - Human-readable description for logs
   *
   * 📚 LEARNING NOTE:
   * Wrapping Playwright actions in helper methods provides:
   * 1. Consistent logging across all tests
   * 2. Centralized error handling
   * 3. Easy modification of behavior project-wide
   */
  protected async clickElement(locator: Locator, description: string = 'element'): Promise<void> {
    console.log(`🖱️ Clicking: ${description}`);
    await locator.click();
  }

  /**
   * Fill a text input with logging.
   *
   * @param locator - Playwright Locator for the input
   * @param text - Text to type
   * @param description - Human-readable description
   *
   * 📚 BEST PRACTICE:
   * fill() clears existing text before typing, which is more
   * reliable than type() for most form scenarios.
   */
  protected async fillInput(locator: Locator, text: string, description: string = 'input'): Promise<void> {
    console.log(`⌨️ Filling ${description} with: "${text}"`);
    await locator.fill(text);
  }

  /**
   * Get text content of an element.
   */
  protected async getElementText(locator: Locator): Promise<string> {
    const text = await locator.textContent();
    return text?.trim() ?? '';
  }

  /**
   * Check if an element is visible.
   */
  protected async isElementVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  /**
   * Check if an element is enabled.
   */
  protected async isElementEnabled(locator: Locator): Promise<boolean> {
    return locator.isEnabled();
  }

  /**
   * Hover over an element.
   */
  protected async hoverElement(locator: Locator, description: string = 'element'): Promise<void> {
    console.log(`🎯 Hovering: ${description}`);
    await locator.hover();
  }

  /**
   * Select an option from a dropdown by value.
   */
  protected async selectByValue(locator: Locator, value: string, description: string = 'dropdown'): Promise<void> {
    console.log(`📋 Selecting value "${value}" in ${description}`);
    await locator.selectOption({ value });
  }

  /**
   * Select an option from a dropdown by visible text.
   */
  protected async selectByText(locator: Locator, text: string, description: string = 'dropdown'): Promise<void> {
    console.log(`📋 Selecting text "${text}" in ${description}`);
    await locator.selectOption({ label: text });
  }

  /**
   * Check or uncheck a checkbox.
   */
  protected async setCheckbox(locator: Locator, checked: boolean, description: string = 'checkbox'): Promise<void> {
    console.log(`☑️ Setting ${description} to: ${checked}`);
    await locator.setChecked(checked);
  }

  /**
   * Upload a file to a file input element.
   */
  protected async uploadFile(locator: Locator, filePath: string): Promise<void> {
    console.log(`📁 Uploading file: ${filePath}`);
    await locator.setInputFiles(filePath);
  }

  // ============================================================
  // WAITING UTILITIES
  // ============================================================

  /**
   * Wait for a specific element to be visible.
   *
   * 📚 LEARNING NOTE:
   * Playwright auto-waits for most actions, but sometimes
   * you need explicit waits for complex scenarios like:
   * - Waiting for loading spinners to disappear
   * - Waiting for dynamic content to load
   * - Waiting for animations to complete
   */
  protected async waitForElement(locator: Locator, timeout: number = 10_000): Promise<void> {
    console.log('⏳ Waiting for element to be visible...');
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden/detached.
   */
  protected async waitForElementHidden(locator: Locator, timeout: number = 10_000): Promise<void> {
    console.log('⏳ Waiting for element to be hidden...');
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Wait for page to reach a specific URL pattern.
   */
  protected async waitForUrl(urlPattern: string | RegExp, timeout: number = 10_000): Promise<void> {
    console.log(`⏳ Waiting for URL: ${urlPattern}`);
    await this.page.waitForURL(urlPattern, { timeout });
  }

  /**
   * Wait for network to be idle (no pending requests).
   */
  protected async waitForNetworkIdle(timeout: number = 10_000): Promise<void> {
    console.log('⏳ Waiting for network idle...');
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Pause execution for debugging.
   *
   * ⚠️ ANTI-PATTERN WARNING:
   * Never use hard waits (setTimeout/waitForTimeout) in production tests!
   * They make tests slow and flaky. Use proper waits instead.
   * This method exists ONLY for debugging purposes.
   */
  protected async debugPause(ms: number = 1000): Promise<void> {
    console.warn(`⚠️ DEBUG PAUSE: ${ms}ms - Remove before committing!`);
    await this.page.waitForTimeout(ms);
  }

  // ============================================================
  // SCREENSHOTS & DEBUGGING
  // ============================================================

  /**
   * Take a screenshot of the current page state.
   *
   * @param name - Descriptive name for the screenshot file
   * @returns Path to the saved screenshot
   */
  async takeScreenshot(name: string): Promise<string> {
    const screenshotPath = `screenshots/${name}-${Date.now()}.png`;
    console.log(`📸 Taking screenshot: ${screenshotPath}`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  }

  /**
   * Take a screenshot of a specific element.
   */
  async takeElementScreenshot(locator: Locator, name: string): Promise<string> {
    const screenshotPath = `screenshots/${name}-${Date.now()}.png`;
    console.log(`📸 Taking element screenshot: ${screenshotPath}`);
    await locator.screenshot({ path: screenshotPath });
    return screenshotPath;
  }

  // ============================================================
  // ASSERTION HELPERS
  // ============================================================

  /**
   * Assert that the page has the expected title.
   */
  async assertTitle(expectedTitle: string | RegExp): Promise<void> {
    console.log(`✅ Asserting title: ${expectedTitle}`);
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Assert that the page URL matches the expected pattern.
   */
  async assertUrl(expectedUrl: string | RegExp): Promise<void> {
    console.log(`✅ Asserting URL: ${expectedUrl}`);
    await expect(this.page).toHaveURL(expectedUrl);
  }

  /**
   * Assert that an element contains expected text.
   */
  protected async assertElementText(locator: Locator, expectedText: string | RegExp): Promise<void> {
    console.log(`✅ Asserting text: ${expectedText}`);
    await expect(locator).toContainText(expectedText);
  }

  /**
   * Assert that an element is visible on the page.
   */
  protected async assertElementVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * Assert that an element is hidden/not visible.
   */
  protected async assertElementHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }

  // ============================================================
  // JAVASCRIPT EXECUTION
  // ============================================================

  /**
   * Execute JavaScript in the browser context.
   *
   * 📚 LEARNING NOTE:
   * page.evaluate() runs code in the browser, not in Node.js.
   * Useful for accessing browser APIs, scrolling, or
   * working with elements that Playwright can't easily reach.
   *
   * ⚠️ Use sparingly - prefer Playwright's built-in methods.
   */
  protected async executeScript<T>(script: string | (() => T)): Promise<T> {
    return this.page.evaluate(script);
  }

  /**
   * Scroll to bottom of the page.
   */
  protected async scrollToBottom(): Promise<void> {
    console.log('📜 Scrolling to bottom');
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Scroll to top of the page.
   */
  protected async scrollToTop(): Promise<void> {
    console.log('📜 Scrolling to top');
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Scroll an element into view.
   */
  protected async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }
}
