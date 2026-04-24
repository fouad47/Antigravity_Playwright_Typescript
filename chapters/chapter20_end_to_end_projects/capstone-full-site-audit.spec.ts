/**
 * ============================================================
 * CHAPTER 20: CAPSTONE - FULL SITE AUDIT
 * ============================================================
 *
 * 📚 This capstone test audits the entire the-internet.herokuapp.com
 * site, verifying every major page and functionality.
 *
 * Demonstrates:
 * - Full framework usage (all page objects)
 * - Component objects
 * - Parallel-safe test design
 * - Comprehensive coverage
 * ============================================================
 */

import { test, expect } from '../../src/fixtures/baseFixtures';

test.describe('🏆 Capstone: Full Site Audit', () => {

  test.describe('Home Page Audit', () => {
    test('should verify home page loads with all example links', async ({ page, navigationComponent }) => {
      await page.goto('/');

      await test.step('Verify page title', async () => {
        await expect(page).toHaveTitle('The Internet');
      });

      await test.step('Verify heading', async () => {
        await expect(page.locator('h1')).toContainText('Welcome to the-internet');
      });

      await test.step('Verify example links are present', async () => {
        const examples = await navigationComponent.getAllExampleNames();
        expect(examples.length).toBeGreaterThan(20);
        console.log(`🏠 Home page has ${examples.length} example links`);
      });

      await test.step('Verify footer', async () => {
        const footer = await navigationComponent.getFooterText();
        expect(footer).toContain('Elemental Selenium');
      });
    });
  });

  test.describe('Form Elements Audit', () => {

    test('should audit checkboxes page', async ({ checkboxesPage }) => {
      await checkboxesPage.navigateTo();
      await checkboxesPage.assertPageLoaded();

      const count = await checkboxesPage.getCheckboxCount();
      expect(count).toBe(2);

      // Toggle all checkboxes
      await checkboxesPage.checkCheckbox(0);
      await checkboxesPage.assertCheckboxChecked(0);
      await checkboxesPage.uncheckCheckbox(1);
      await checkboxesPage.assertCheckboxUnchecked(1);

      console.log('☑️ Checkboxes page: PASSED');
    });

    test('should audit dropdown page', async ({ dropdownPage }) => {
      await dropdownPage.navigateTo();
      await dropdownPage.assertPageLoaded();

      const options = await dropdownPage.getAllOptionTexts();
      expect(options.length).toBeGreaterThan(1);

      // Test all options
      await dropdownPage.selectOptionByValue('1');
      await dropdownPage.assertSelectedValue('1');

      await dropdownPage.selectOptionByValue('2');
      await dropdownPage.assertSelectedValue('2');

      console.log('📋 Dropdown page: PASSED');
    });

    test('should audit inputs page', async ({ inputsPage }) => {
      await inputsPage.navigateTo();
      await inputsPage.assertPageLoaded();

      await inputsPage.enterNumber('42');
      await inputsPage.assertInputValue('42');

      await inputsPage.clearInput();
      await inputsPage.incrementWithArrowUp(5);
      const value = await inputsPage.getInputValue();
      expect(value).toBe('5');

      console.log('🔢 Inputs page: PASSED');
    });
  });

  test.describe('Dynamic Content Audit', () => {

    test('should audit dynamic controls page', async ({ dynamicControlsPage }) => {
      await dynamicControlsPage.navigateTo();
      await dynamicControlsPage.assertPageLoaded();

      // Test checkbox remove/add
      await dynamicControlsPage.clickRemoveAddButton();
      await dynamicControlsPage.assertCheckboxRemoved();

      await dynamicControlsPage.clickRemoveAddButton();
      await dynamicControlsPage.assertCheckboxAdded();

      console.log('🔄 Dynamic Controls page: PASSED');
    });

    test('should audit dynamic loading page', async ({ dynamicLoadingPage }) => {
      await dynamicLoadingPage.navigateToExample1();
      await dynamicLoadingPage.startAndWaitForLoading();
      await dynamicLoadingPage.assertFinishText();

      console.log('⏳ Dynamic Loading page: PASSED');
    });

    test('should audit add/remove elements page', async ({ addRemoveElementsPage }) => {
      await addRemoveElementsPage.navigateTo();
      await addRemoveElementsPage.assertPageLoaded();

      await addRemoveElementsPage.addMultipleElements(5);
      await addRemoveElementsPage.assertDeleteButtonCount(5);

      await addRemoveElementsPage.removeAllElements();
      await addRemoveElementsPage.assertNoDeleteButtons();

      console.log('➕ Add/Remove Elements page: PASSED');
    });
  });

  test.describe('Interactive Elements Audit', () => {

    test('should audit hovers page', async ({ hoversPage }) => {
      await hoversPage.navigateTo();
      await hoversPage.assertPageLoaded();

      const count = await hoversPage.getUserCount();
      expect(count).toBe(3);

      for (let i = 0; i < count; i++) {
        const name = await hoversPage.getUsernameOnHover(i);
        expect(name).toContain('user');
      }

      console.log('🎯 Hovers page: PASSED');
    });

    test('should audit JavaScript alerts page', async ({ jsAlertsPage }) => {
      await jsAlertsPage.navigateTo();
      await jsAlertsPage.assertPageLoaded();

      // Test all three alert types
      await jsAlertsPage.triggerAlertAndAccept();
      await jsAlertsPage.assertResult('You successfully clicked an alert');

      await jsAlertsPage.triggerConfirmAndAccept();
      await jsAlertsPage.assertResult('You clicked: Ok');

      await jsAlertsPage.triggerPromptAndEnterText('Test');
      await jsAlertsPage.assertResult('You entered: Test');

      console.log('🔔 JavaScript Alerts page: PASSED');
    });

    test('should audit key presses page', async ({ keyPressesPage }) => {
      await keyPressesPage.navigateTo();
      await keyPressesPage.assertPageLoaded();

      await keyPressesPage.pressKey('A');
      await keyPressesPage.assertKeyPressed('A');

      await keyPressesPage.pressKey('Enter');
      await keyPressesPage.assertKeyPressed('ENTER');

      console.log('⌨️ Key Presses page: PASSED');
    });
  });

  test.describe('Tables Audit', () => {

    test('should audit sortable tables page', async ({ tablesPage }) => {
      await tablesPage.navigateTo();
      await tablesPage.assertPageLoaded();

      // Verify data structure
      const data = await tablesPage.getTable1Data();
      expect(data.length).toBe(4);

      // Verify specific data
      const smith = await tablesPage.findRowByLastName('Smith');
      expect(smith).toBeTruthy();
      expect(smith?.email).toContain('@');

      // Test sorting
      await tablesPage.sortTable1ByColumn('Last Name');

      console.log('📊 Tables page: PASSED');
    });
  });

  test.describe('Navigation Audit', () => {

    test('should audit frames page', async ({ framesPage }) => {
      await framesPage.navigateToNestedFrames();

      const middleText = await framesPage.getTopMiddleFrameText();
      expect(middleText).toContain('MIDDLE');

      const bottomText = await framesPage.getBottomFrameText();
      expect(bottomText).toContain('BOTTOM');

      console.log('🖼️ Frames page: PASSED');
    });

    test('should audit multiple windows page', async ({ multipleWindowsPage }) => {
      await multipleWindowsPage.navigateTo();
      await multipleWindowsPage.assertPageLoaded();

      const newPage = await multipleWindowsPage.clickAndGetNewWindow();
      const text = await multipleWindowsPage.getNewWindowText(newPage);
      expect(text).toBe('New Window');
      await newPage.close();

      console.log('🪟 Multiple Windows page: PASSED');
    });
  });

  test.describe('Content Verification Audit', () => {

    test('should audit broken images page', async ({ brokenImagesPage }) => {
      await brokenImagesPage.navigateTo();
      await brokenImagesPage.assertPageLoaded();

      const brokenIndices = await brokenImagesPage.getBrokenImageIndices();
      console.log(`🖼️ Found ${brokenIndices.length} broken images`);
      // At least some images should be broken (that's the demo point)
      expect(brokenIndices.length).toBeGreaterThan(0);

      console.log('🖼️ Broken Images page: PASSED');
    });

    test('should audit status codes page', async ({ statusCodesPage }) => {
      await statusCodesPage.navigateTo();
      await statusCodesPage.assertPageLoaded();

      const codes = await statusCodesPage.getAvailableStatusCodes();
      expect(codes.length).toBeGreaterThan(0);

      // Test 200 status code
      const status = await statusCodesPage.navigateToStatusCode(200);
      expect(status).toBe(200);

      console.log('📡 Status Codes page: PASSED');
    });
  });

  test.describe('Authentication Audit', () => {

    test('should audit basic auth', async ({ browser }) => {
      const context = await browser.newContext({
        httpCredentials: { username: 'admin', password: 'admin' },
      });
      const page = await context.newPage();
      await page.goto('/basic_auth');

      await expect(page.locator('.example p')).toContainText('Congratulations');
      console.log('🔐 Basic Auth page: PASSED');

      await context.close();
    });
  });
});
