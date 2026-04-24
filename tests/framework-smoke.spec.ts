/**
 * ============================================================
 * FRAMEWORK INTEGRATION TESTS
 * ============================================================
 *
 * These tests verify the core framework components work correctly
 * with the application under test. They serve as the "always-run"
 * regression suite for the framework itself.
 * ============================================================
 */

import { test, expect } from '../src/fixtures/baseFixtures';

test.describe('Framework Smoke Tests @smoke', () => {

  test('should navigate using LoginPage POM', async ({ loginPage }) => {
    await loginPage.navigateTo();
    await loginPage.assertPageLoaded();
  });

  test('should login and logout', async ({ loginPage }) => {
    await loginPage.navigateTo();
    await loginPage.loginWithDefaults();
    await loginPage.assertLoginSuccess();
    await loginPage.logout();
  });

  test('should interact with checkboxes POM', async ({ checkboxesPage }) => {
    await checkboxesPage.navigateTo();
    await checkboxesPage.assertPageLoaded();
    await checkboxesPage.checkCheckbox(0);
    await checkboxesPage.assertCheckboxChecked(0);
  });

  test('should interact with dropdown POM', async ({ dropdownPage }) => {
    await dropdownPage.navigateTo();
    await dropdownPage.selectOptionByValue('1');
    await dropdownPage.assertSelectedValue('1');
  });

  test('should handle JavaScript alerts POM', async ({ jsAlertsPage }) => {
    await jsAlertsPage.navigateTo();
    await jsAlertsPage.triggerAlertAndAccept();
    await jsAlertsPage.assertResult('You successfully clicked an alert');
  });

  test('should extract table data POM', async ({ tablesPage }) => {
    await tablesPage.navigateTo();
    const data = await tablesPage.getTable1Data();
    expect(data.length).toBe(4);
    expect(data[0].lastName).toBeTruthy();
  });

  test('should handle hovers POM', async ({ hoversPage }) => {
    await hoversPage.navigateTo();
    const name = await hoversPage.getUsernameOnHover(0);
    expect(name).toContain('user');
  });

  test('should handle dynamic loading POM', async ({ dynamicLoadingPage }) => {
    await dynamicLoadingPage.navigateToExample1();
    await dynamicLoadingPage.startAndWaitForLoading();
    await dynamicLoadingPage.assertFinishText();
  });
});

test.describe('Framework Utility Tests @smoke', () => {

  test('should use NavigationComponent', async ({ page, navigationComponent }) => {
    await page.goto('/');
    const examples = await navigationComponent.getAllExampleNames();
    expect(examples.length).toBeGreaterThan(20);
  });

  test('should use WaitHelper', async ({ page, waitHelper }) => {
    await page.goto('/');
    await waitHelper.waitForPageFullyLoaded();
    await expect(page).toHaveTitle('The Internet');
  });

  test('should use Logger', async ({ logger }) => {
    logger.testStart('Utility Test');
    logger.info('Testing logger utility');
    logger.step(1, 'First step');
    logger.step(2, 'Second step');
    logger.testEnd('Utility Test', true);
  });
});
