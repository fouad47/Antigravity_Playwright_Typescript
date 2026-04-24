/**
 * ============================================================
 * CHAPTER 14: PAGE OBJECT MODEL FRAMEWORK IN ACTION
 * ============================================================
 *
 * 📚 This chapter demonstrates using our complete POM framework.
 * All page objects, fixtures, and utilities come together here.
 *
 * 🏗️ ARCHITECTURE:
 * Tests → Fixtures → Page Objects → Playwright API
 *
 * Tests: Business-level test scenarios
 * Fixtures: Provide page objects and utilities
 * Page Objects: Encapsulate page interactions
 * Playwright API: Low-level browser control
 * ============================================================
 */

import { test, expect } from '../../src/fixtures/baseFixtures';

test.describe('Login Page Tests (using POM)', () => {

  test('should login with valid credentials', async ({ loginPage }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigateTo();
      await loginPage.assertPageLoaded();
    });

    await test.step('Login with default credentials', async () => {
      await loginPage.loginWithDefaults();
    });

    await test.step('Verify successful login', async () => {
      await loginPage.assertLoginSuccess();
      await loginPage.assertSecureAreaDisplayed();
    });
  });

  test('should fail with invalid username', async ({ loginPage }) => {
    await loginPage.navigateTo();
    await loginPage.login('invaliduser', 'SuperSecretPassword!');
    await loginPage.assertLoginFailure();
  });

  test('should fail with invalid password', async ({ loginPage }) => {
    await loginPage.navigateTo();
    await loginPage.login('tomsmith', 'wrongpassword');
    await loginPage.assertInvalidPassword();
  });

  test('should logout successfully', async ({ loginPage }) => {
    await loginPage.navigateTo();
    await loginPage.loginWithDefaults();
    await loginPage.assertSecureAreaDisplayed();
    await loginPage.logout();
    // Should be back on login page
    await loginPage.assertPageLoaded();
  });
});

test.describe('Checkboxes Tests (using POM)', () => {

  test('should verify checkbox states', async ({ checkboxesPage }) => {
    await checkboxesPage.navigateTo();
    await checkboxesPage.assertPageLoaded();

    // Verify default states
    await checkboxesPage.assertCheckboxUnchecked(0);
    await checkboxesPage.assertCheckboxChecked(1);
  });

  test('should toggle checkboxes', async ({ checkboxesPage }) => {
    await checkboxesPage.navigateTo();

    await checkboxesPage.checkCheckbox(0);
    await checkboxesPage.assertCheckboxChecked(0);

    await checkboxesPage.uncheckCheckbox(1);
    await checkboxesPage.assertCheckboxUnchecked(1);
  });
});

test.describe('Dropdown Tests (using POM)', () => {

  test('should select options in dropdown', async ({ dropdownPage }) => {
    await dropdownPage.navigateTo();
    await dropdownPage.assertPageLoaded();

    await dropdownPage.selectOptionByText('Option 1');
    await dropdownPage.assertSelectedValue('1');

    await dropdownPage.selectOptionByText('Option 2');
    await dropdownPage.assertSelectedValue('2');
  });
});

test.describe('Dynamic Controls Tests (using POM)', () => {

  test('should remove and add checkbox', async ({ dynamicControlsPage }) => {
    await dynamicControlsPage.navigateTo();

    await dynamicControlsPage.clickRemoveAddButton();
    await dynamicControlsPage.assertCheckboxRemoved();

    await dynamicControlsPage.clickRemoveAddButton();
    await dynamicControlsPage.assertCheckboxAdded();
  });

  test('should enable and disable input', async ({ dynamicControlsPage }) => {
    await dynamicControlsPage.navigateTo();

    await dynamicControlsPage.clickEnableDisableButton();
    await dynamicControlsPage.assertInputEnabled();

    await dynamicControlsPage.enterText('Playwright is awesome!');
  });
});

test.describe('Hovers Tests (using POM)', () => {

  test('should show user info on hover', async ({ hoversPage }) => {
    await hoversPage.navigateTo();
    await hoversPage.assertPageLoaded();

    // Hover over each user and verify info appears
    const count = await hoversPage.getUserCount();
    for (let i = 0; i < count; i++) {
      await hoversPage.assertUserInfoVisibleOnHover(i);
      const name = await hoversPage.getUsernameOnHover(i);
      console.log(`User ${i + 1}: ${name}`);
    }
  });
});

test.describe('Tables Tests (using POM)', () => {

  test('should extract and verify table data', async ({ tablesPage }) => {
    await tablesPage.navigateTo();
    await tablesPage.assertPageLoaded();

    const data = await tablesPage.getTable1Data();
    console.log(`Table has ${data.length} rows`);
    expect(data.length).toBe(4);

    // Find specific row
    const smithRow = await tablesPage.findRowByLastName('Smith');
    expect(smithRow).toBeTruthy();
    console.log(`Smith's email: ${smithRow?.email}`);
  });
});

test.describe('JavaScript Alerts Tests (using POM)', () => {

  test('should handle all alert types', async ({ jsAlertsPage }) => {
    await jsAlertsPage.navigateTo();
    await jsAlertsPage.assertPageLoaded();

    // JS Alert
    await jsAlertsPage.triggerAlertAndAccept();
    await jsAlertsPage.assertResult('You successfully clicked an alert');

    // JS Confirm - Accept
    await jsAlertsPage.triggerConfirmAndAccept();
    await jsAlertsPage.assertResult('You clicked: Ok');

    // JS Confirm - Dismiss
    await jsAlertsPage.triggerConfirmAndDismiss();
    await jsAlertsPage.assertResult('You clicked: Cancel');

    // JS Prompt
    await jsAlertsPage.triggerPromptAndEnterText('Hello Playwright!');
    await jsAlertsPage.assertResult('You entered: Hello Playwright!');
  });
});

test.describe('Multiple Windows Tests (using POM)', () => {

  test('should handle new window', async ({ multipleWindowsPage }) => {
    await multipleWindowsPage.navigateTo();
    await multipleWindowsPage.assertPageLoaded();

    const newPage = await multipleWindowsPage.clickAndGetNewWindow();
    const newText = await multipleWindowsPage.getNewWindowText(newPage);
    expect(newText).toBe('New Window');

    await newPage.close();
  });
});
