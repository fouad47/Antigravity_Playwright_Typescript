/**
 * ============================================================
 * COMPREHENSIVE REGRESSION TESTS
 * ============================================================
 *
 * Full regression suite covering all page objects  
 * against the-internet.herokuapp.com.
 *
 * Run with: npx playwright test tests/regression.spec.ts
 * ============================================================
 */

import { test, expect } from '../src/fixtures/baseFixtures';
import { TestDataGenerator } from '../src/utils/TestDataGenerator';

test.describe('Login Regression @regression', () => {

  test('valid login', async ({ loginPage }) => {
    await loginPage.navigateTo();
    await loginPage.loginWithDefaults();
    await loginPage.assertLoginSuccess();
    await loginPage.assertSecureAreaDisplayed();
  });

  test('invalid username shows error', async ({ loginPage }) => {
    await loginPage.navigateTo();
    await loginPage.login('baduser', 'SuperSecretPassword!');
    await loginPage.assertLoginFailure();
  });

  test('invalid password shows error', async ({ loginPage }) => {
    await loginPage.navigateTo();
    await loginPage.login('tomsmith', 'wrongpass');
    await loginPage.assertInvalidPassword();
  });

  test('logout redirects to login', async ({ loginPage }) => {
    await loginPage.navigateTo();
    await loginPage.loginWithDefaults();
    await loginPage.logout();
    await loginPage.assertPageLoaded();
  });
});

test.describe('Form Elements Regression @regression', () => {

  test('checkboxes toggle correctly', async ({ checkboxesPage }) => {
    await checkboxesPage.navigateTo();
    
    // Default states
    await checkboxesPage.assertCheckboxUnchecked(0);
    await checkboxesPage.assertCheckboxChecked(1);
    
    // Toggle
    await checkboxesPage.toggleCheckbox(0);
    await checkboxesPage.assertCheckboxChecked(0);
    
    await checkboxesPage.toggleCheckbox(1);
    await checkboxesPage.assertCheckboxUnchecked(1);
  });

  test('dropdown selects all options', async ({ dropdownPage }) => {
    await dropdownPage.navigateTo();
    
    await dropdownPage.selectOptionByText('Option 1');
    await dropdownPage.assertSelectedValue('1');

    await dropdownPage.selectOptionByText('Option 2');
    await dropdownPage.assertSelectedValue('2');
  });

  test('inputs accept number values', async ({ inputsPage }) => {
    await inputsPage.navigateTo();
    await inputsPage.enterNumber('42');
    await inputsPage.assertInputValue('42');

    await inputsPage.clearInput();
    await inputsPage.incrementWithArrowUp(3);
    await inputsPage.assertInputValue('3');
  });
});

test.describe('Dynamic Content Regression @regression', () => {

  test('dynamic controls remove and add checkbox', async ({ dynamicControlsPage }) => {
    await dynamicControlsPage.navigateTo();

    await dynamicControlsPage.clickRemoveAddButton();
    await dynamicControlsPage.assertCheckboxRemoved();

    await dynamicControlsPage.clickRemoveAddButton();
    await dynamicControlsPage.assertCheckboxAdded();
  });

  test('dynamic controls enable input', async ({ dynamicControlsPage }) => {
    await dynamicControlsPage.navigateTo();

    await dynamicControlsPage.clickEnableDisableButton();
    await dynamicControlsPage.assertInputEnabled();

    await dynamicControlsPage.enterText('Test input');
  });

  test('dynamic loading shows content', async ({ dynamicLoadingPage }) => {
    await dynamicLoadingPage.navigateToExample2();
    await dynamicLoadingPage.startAndWaitForLoading();
    await dynamicLoadingPage.assertFinishText('Hello World!');
  });

  test('add remove elements works', async ({ addRemoveElementsPage }) => {
    await addRemoveElementsPage.navigateTo();
    await addRemoveElementsPage.addMultipleElements(3);
    await addRemoveElementsPage.assertDeleteButtonCount(3);
    await addRemoveElementsPage.removeLastElement();
    await addRemoveElementsPage.assertDeleteButtonCount(2);
  });
});

test.describe('Interactive Elements Regression @regression', () => {

  test('hovers reveal user info', async ({ hoversPage }) => {
    await hoversPage.navigateTo();
    
    for (let i = 0; i < 3; i++) {
      await hoversPage.assertUserInfoVisibleOnHover(i);
    }
  });

  test('alerts handle all dialog types', async ({ jsAlertsPage }) => {
    await jsAlertsPage.navigateTo();

    await jsAlertsPage.triggerAlertAndAccept();
    await jsAlertsPage.assertResult('You successfully clicked an alert');

    await jsAlertsPage.triggerConfirmAndDismiss();
    await jsAlertsPage.assertResult('You clicked: Cancel');

    await jsAlertsPage.triggerPromptAndEnterText('Playwright');
    await jsAlertsPage.assertResult('You entered: Playwright');
  });

  test('key presses are detected', async ({ keyPressesPage }) => {
    await keyPressesPage.navigateTo();
    await keyPressesPage.pressKey('A');
    await keyPressesPage.assertKeyPressed('A');
  });
});

test.describe('Tables Regression @regression', () => {

  test('table data extraction works', async ({ tablesPage }) => {
    await tablesPage.navigateTo();
    
    await tablesPage.assertTable1HasRows(4);
    
    const data = await tablesPage.getTable1Data();
    expect(data.every((row) => row.email.includes('@'))).toBeTruthy();
  });

  test('table sorting works', async ({ tablesPage }) => {
    await tablesPage.navigateTo();
    await tablesPage.sortTable1ByColumn('Last Name');
    await tablesPage.assertTable1ColumnSorted(0, true);
  });
});

test.describe('Navigation Regression @regression', () => {

  test('frames content is accessible', async ({ framesPage }) => {
    await framesPage.navigateToNestedFrames();
    
    const middle = await framesPage.getTopMiddleFrameText();
    expect(middle).toContain('MIDDLE');
    
    const bottom = await framesPage.getBottomFrameText();
    expect(bottom).toContain('BOTTOM');
  });

  test('new window opens correctly', async ({ multipleWindowsPage }) => {
    await multipleWindowsPage.navigateTo();
    const newPage = await multipleWindowsPage.clickAndGetNewWindow();
    const text = await multipleWindowsPage.getNewWindowText(newPage);
    expect(text).toBe('New Window');
    await newPage.close();
  });
});

test.describe('Content Verification Regression @regression', () => {

  test('broken images detected', async ({ brokenImagesPage }) => {
    await brokenImagesPage.navigateTo();
    const broken = await brokenImagesPage.getBrokenImageIndices();
    expect(broken.length).toBeGreaterThan(0);
  });

  test('status codes accessible', async ({ statusCodesPage }) => {
    await statusCodesPage.navigateTo();
    const codes = await statusCodesPage.getAvailableStatusCodes();
    expect(codes.length).toBeGreaterThan(0);
  });
});
