/**
 * ============================================================
 * BASE FIXTURES - Custom Test Fixtures
 * ============================================================
 *
 * 📚 LEARNING NOTES:
 * Fixtures are the Playwright way to set up and tear down
 * test dependencies. They replace beforeEach/afterEach for
 * providing shared resources to tests.
 *
 * Custom fixtures allow you to:
 * 1. Inject page objects into tests automatically
 * 2. Share browser contexts across tests
 * 3. Set up authenticated sessions
 * 4. Provide utility instances
 *
 * 🏗️ OOP - DEPENDENCY INJECTION:
 * Fixtures inject dependencies (page objects, utilities)
 * into test functions. Tests don't create their own dependencies.
 * ============================================================
 */

import { test as base, Page } from '@playwright/test';
import {
  LoginPage,
  CheckboxesPage,
  DropdownPage,
  DynamicControlsPage,
  DynamicLoadingPage,
  FileUploadPage,
  HoversPage,
  JavaScriptAlertsPage,
  KeyPressesPage,
  TablesPage,
  FramesPage,
  MultipleWindowsPage,
  DragAndDropPage,
  AddRemoveElementsPage,
  ChallengingDOMPage,
  BrokenImagesPage,
  InputsPage,
  InfiniteScrollPage,
  NotificationMessagesPage,
  StatusCodesPage,
} from '../pages';
import { NavigationComponent, TableComponent } from '../components';
import { Logger, WaitHelper, ScreenshotHelper } from '../utils';

/**
 * Define the types for our custom fixtures.
 * This gives us TypeScript IntelliSense in tests.
 */
type CustomFixtures = {
  // Page Objects
  loginPage: LoginPage;
  checkboxesPage: CheckboxesPage;
  dropdownPage: DropdownPage;
  dynamicControlsPage: DynamicControlsPage;
  dynamicLoadingPage: DynamicLoadingPage;
  fileUploadPage: FileUploadPage;
  hoversPage: HoversPage;
  jsAlertsPage: JavaScriptAlertsPage;
  keyPressesPage: KeyPressesPage;
  tablesPage: TablesPage;
  framesPage: FramesPage;
  multipleWindowsPage: MultipleWindowsPage;
  dragAndDropPage: DragAndDropPage;
  addRemoveElementsPage: AddRemoveElementsPage;
  challengingDOMPage: ChallengingDOMPage;
  brokenImagesPage: BrokenImagesPage;
  inputsPage: InputsPage;
  infiniteScrollPage: InfiniteScrollPage;
  notificationMessagesPage: NotificationMessagesPage;
  statusCodesPage: StatusCodesPage;

  // Components
  navigationComponent: NavigationComponent;

  // Utilities
  logger: Logger;
  waitHelper: WaitHelper;
  screenshotHelper: ScreenshotHelper;
};

/**
 * Extended test with custom fixtures.
 *
 * 📚 LEARNING NOTE:
 * base.extend() creates a new test function with additional fixtures.
 * Each fixture is a function that receives { page } and provides
 * the fixture value via the 'use' callback.
 *
 * The code BEFORE 'use' is setup (like beforeEach).
 * The code AFTER 'use' is teardown (like afterEach).
 */
export const test = base.extend<CustomFixtures>({
  // ============================================================
  // PAGE OBJECT FIXTURES
  // ============================================================

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  checkboxesPage: async ({ page }, use) => {
    const checkboxesPage = new CheckboxesPage(page);
    await use(checkboxesPage);
  },

  dropdownPage: async ({ page }, use) => {
    const dropdownPage = new DropdownPage(page);
    await use(dropdownPage);
  },

  dynamicControlsPage: async ({ page }, use) => {
    const dynamicControlsPage = new DynamicControlsPage(page);
    await use(dynamicControlsPage);
  },

  dynamicLoadingPage: async ({ page }, use) => {
    const dynamicLoadingPage = new DynamicLoadingPage(page);
    await use(dynamicLoadingPage);
  },

  fileUploadPage: async ({ page }, use) => {
    const fileUploadPage = new FileUploadPage(page);
    await use(fileUploadPage);
  },

  hoversPage: async ({ page }, use) => {
    const hoversPage = new HoversPage(page);
    await use(hoversPage);
  },

  jsAlertsPage: async ({ page }, use) => {
    const jsAlertsPage = new JavaScriptAlertsPage(page);
    await use(jsAlertsPage);
  },

  keyPressesPage: async ({ page }, use) => {
    const keyPressesPage = new KeyPressesPage(page);
    await use(keyPressesPage);
  },

  tablesPage: async ({ page }, use) => {
    const tablesPage = new TablesPage(page);
    await use(tablesPage);
  },

  framesPage: async ({ page }, use) => {
    const framesPage = new FramesPage(page);
    await use(framesPage);
  },

  multipleWindowsPage: async ({ page }, use) => {
    const multipleWindowsPage = new MultipleWindowsPage(page);
    await use(multipleWindowsPage);
  },

  dragAndDropPage: async ({ page }, use) => {
    const dragAndDropPage = new DragAndDropPage(page);
    await use(dragAndDropPage);
  },

  addRemoveElementsPage: async ({ page }, use) => {
    const addRemoveElementsPage = new AddRemoveElementsPage(page);
    await use(addRemoveElementsPage);
  },

  challengingDOMPage: async ({ page }, use) => {
    const challengingDOMPage = new ChallengingDOMPage(page);
    await use(challengingDOMPage);
  },

  brokenImagesPage: async ({ page }, use) => {
    const brokenImagesPage = new BrokenImagesPage(page);
    await use(brokenImagesPage);
  },

  inputsPage: async ({ page }, use) => {
    const inputsPage = new InputsPage(page);
    await use(inputsPage);
  },

  infiniteScrollPage: async ({ page }, use) => {
    const infiniteScrollPage = new InfiniteScrollPage(page);
    await use(infiniteScrollPage);
  },

  notificationMessagesPage: async ({ page }, use) => {
    const notificationMessagesPage = new NotificationMessagesPage(page);
    await use(notificationMessagesPage);
  },

  statusCodesPage: async ({ page }, use) => {
    const statusCodesPage = new StatusCodesPage(page);
    await use(statusCodesPage);
  },

  // ============================================================
  // COMPONENT FIXTURES
  // ============================================================

  navigationComponent: async ({ page }, use) => {
    const nav = new NavigationComponent(page);
    await use(nav);
  },

  // ============================================================
  // UTILITY FIXTURES
  // ============================================================

  logger: async ({}, use) => {
    const logger = Logger.getInstance();
    await use(logger);
    logger.flush(); // Teardown: write logs to file
  },

  waitHelper: async ({ page }, use) => {
    const waitHelper = new WaitHelper(page);
    await use(waitHelper);
  },

  screenshotHelper: async ({ page }, use) => {
    const screenshotHelper = new ScreenshotHelper(page);
    await use(screenshotHelper);
  },
});

// Re-export expect for convenience
export { expect } from '@playwright/test';
