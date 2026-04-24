/**
 * ============================================================
 * LOGIN PAGE - Page Object Model
 * ============================================================
 *
 * URL: /login
 * Functionality: Form Authentication with username/password
 *
 * 📚 OOP CONCEPTS:
 * - Inheritance: LoginPage extends BasePage
 * - Encapsulation: Locators are private, actions are public
 * - Single Responsibility: Only handles login page interactions
 * ============================================================
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // ============================================================
  // PAGE PATH
  // ============================================================
  protected readonly path = '/login';

  // ============================================================
  // LOCATORS
  // ============================================================

  /**
   * 📚 BEST PRACTICE: Define locators as readonly properties.
   * This prevents accidental modification and makes them
   * easy to find and maintain.
   *
   * 💡 Locator Strategy Priority:
   * 1. getByRole() - Most accessible and resilient
   * 2. getByLabel() - Great for form inputs
   * 3. getByPlaceholder() - When label isn't available
   * 4. getByTestId() - When other strategies don't work
   * 5. CSS/XPath - Last resort
   */
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly flashMessage: Locator;
  private readonly logoutButton: Locator;
  private readonly headerText: Locator;
  private readonly subHeaderText: Locator;

  constructor(page: Page) {
    super(page);

    // Using getByLabel - best for form inputs with labels
    this.usernameInput = this.page.locator('#username');
    this.passwordInput = this.page.locator('#password');

    // Using getByRole - most resilient locator strategy
    this.loginButton = this.page.getByRole('button', { name: 'Login' });

    // Using CSS selector for flash messages
    this.flashMessage = this.page.locator('#flash');

    // Logout button appears after successful login
    this.logoutButton = this.page.getByRole('link', { name: /Logout/i });

    // Page headers
    this.headerText = this.page.locator('h2');
    this.subHeaderText = this.page.locator('.subheader');
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Log in with provided credentials.
   *
   * 📚 LEARNING NOTE:
   * This is a high-level action method that combines multiple
   * low-level interactions. Page objects should expose
   * business-level actions, not raw element interactions.
   */
  async login(username: string, password: string): Promise<void> {
    console.log(`🔐 Logging in as: ${username}`);
    await this.fillInput(this.usernameInput, username, 'username');
    await this.fillInput(this.passwordInput, password, 'password');
    await this.clickElement(this.loginButton, 'Login button');
  }

  /**
   * Log in with default test credentials from environment.
   */
  async loginWithDefaults(): Promise<void> {
    const username = process.env.TEST_USERNAME || 'tomsmith';
    const password = process.env.TEST_PASSWORD || 'SuperSecretPassword!';
    await this.login(username, password);
  }

  /**
   * Log out from the secure area.
   */
  async logout(): Promise<void> {
    console.log('🔓 Logging out');
    await this.clickElement(this.logoutButton, 'Logout button');
  }

  /**
   * Enter username only (partial interaction for testing).
   */
  async enterUsername(username: string): Promise<void> {
    await this.fillInput(this.usernameInput, username, 'username');
  }

  /**
   * Enter password only (partial interaction for testing).
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password, 'password');
  }

  /**
   * Click the login button.
   */
  async clickLogin(): Promise<void> {
    await this.clickElement(this.loginButton, 'Login button');
  }

  // ============================================================
  // GETTERS / STATE QUERIES
  // ============================================================

  /**
   * Get the flash message text (success or error).
   *
   * 📚 LEARNING NOTE:
   * Getter methods return page state without modifying it.
   * They're essential for assertions in test files.
   */
  async getFlashMessage(): Promise<string> {
    return this.getElementText(this.flashMessage);
  }

  /**
   * Get the page header text.
   */
  async getHeaderText(): Promise<string> {
    return this.getElementText(this.headerText);
  }

  /**
   * Check if login was successful by verifying the flash message.
   */
  async isLoginSuccessful(): Promise<boolean> {
    const message = await this.getFlashMessage();
    return message.includes('You logged into a secure area!');
  }

  /**
   * Check if logout button is visible (indicates logged-in state).
   */
  async isLoggedIn(): Promise<boolean> {
    return this.isElementVisible(this.logoutButton);
  }

  // ============================================================
  // ASSERTIONS (Page-specific)
  // ============================================================

  /**
   * Assert successful login.
   */
  async assertLoginSuccess(): Promise<void> {
    await this.assertElementText(this.flashMessage, 'You logged into a secure area!');
  }

  /**
   * Assert login failure with invalid credentials.
   */
  async assertLoginFailure(): Promise<void> {
    await this.assertElementText(this.flashMessage, 'Your username is invalid!');
  }

  /**
   * Assert invalid password error.
   */
  async assertInvalidPassword(): Promise<void> {
    await this.assertElementText(this.flashMessage, 'Your password is invalid!');
  }

  /**
   * Assert the login page is loaded.
   */
  async assertPageLoaded(): Promise<void> {
    await this.assertElementText(this.headerText, 'Login Page');
    await this.assertElementVisible(this.usernameInput);
    await this.assertElementVisible(this.passwordInput);
    await this.assertElementVisible(this.loginButton);
  }

  /**
   * Assert secure area is displayed after login.
   */
  async assertSecureAreaDisplayed(): Promise<void> {
    await this.assertElementVisible(this.logoutButton);
    await this.assertUrl(/\/secure/);
  }
}
