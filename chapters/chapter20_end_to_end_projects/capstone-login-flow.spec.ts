/**
 * ============================================================
 * CHAPTER 20: CAPSTONE - COMPLETE LOGIN FLOW E2E TEST
 * ============================================================
 *
 * 📚 This capstone demonstrates ALL learned concepts:
 * ✅ Page Object Model
 * ✅ Custom Fixtures
 * ✅ test.step() for structured logging
 * ✅ Data-driven testing
 * ✅ Assertions (auto-retrying + generic)
 * ✅ Screenshot capture
 * ✅ Error handling
 * ✅ OOP principles
 * ============================================================
 */

import { test, expect } from '../../src/fixtures/baseFixtures';
import { TestDataGenerator } from '../../src/utils/TestDataGenerator';

test.describe('🏆 Capstone: Complete Login Flow', () => {

  test.describe('Happy Path - Successful Login & Logout', () => {

    test('should complete full login → secure area → logout flow', async ({
      loginPage,
      screenshotHelper,
    }, testInfo) => {

      await test.step('1️⃣ Navigate to login page', async () => {
        await loginPage.navigateTo();
        await loginPage.assertPageLoaded();
        console.log('✅ Login page loaded successfully');
      });

      await test.step('2️⃣ Verify login page elements', async () => {
        const header = await loginPage.getHeaderText();
        expect(header).toContain('Login Page');
      });

      await test.step('3️⃣ Enter valid credentials', async () => {
        await loginPage.login('tomsmith', 'SuperSecretPassword!');
      });

      await test.step('4️⃣ Verify successful login', async () => {
        await loginPage.assertLoginSuccess();
        await loginPage.assertSecureAreaDisplayed();
        console.log('✅ Successfully logged in to secure area');
      });

      await test.step('5️⃣ Capture success screenshot', async () => {
        await screenshotHelper.captureAlways(testInfo, 'login-success');
      });

      await test.step('6️⃣ Logout', async () => {
        await loginPage.logout();
        console.log('✅ Successfully logged out');
      });

      await test.step('7️⃣ Verify return to login page', async () => {
        await loginPage.assertPageLoaded();
      });
    });
  });

  test.describe('Negative Paths - Login Failures', () => {

    const invalidCredentials = [
      {
        scenario: 'invalid username',
        username: 'baduser',
        password: 'SuperSecretPassword!',
        expectedError: 'Your username is invalid!',
      },
      {
        scenario: 'invalid password',
        username: 'tomsmith',
        password: 'wrongpass',
        expectedError: 'Your password is invalid!',
      },
      {
        scenario: 'empty fields',
        username: '',
        password: '',
        expectedError: 'Your username is invalid!',
      },
    ];

    for (const cred of invalidCredentials) {
      test(`should show error for ${cred.scenario}`, async ({ loginPage }) => {
        await test.step('Navigate to login page', async () => {
          await loginPage.navigateTo();
        });

        await test.step(`Enter ${cred.scenario}`, async () => {
          await loginPage.login(cred.username, cred.password);
        });

        await test.step('Verify error message displayed', async () => {
          const message = await loginPage.getFlashMessage();
          expect(message).toContain(cred.expectedError);
          console.log(`✅ Error for "${cred.scenario}": ${cred.expectedError}`);
        });
      });
    }

    test('should reject random/faked credentials', async ({ loginPage }) => {
      const fakeUser = TestDataGenerator.generateUser();
      
      await loginPage.navigateTo();
      await loginPage.login(fakeUser.username, fakeUser.password);

      const message = await loginPage.getFlashMessage();
      expect(message).toContain('Your username is invalid!');
      console.log(`✅ Rejected random user: ${fakeUser.username}`);
    });
  });

  test.describe('Security Scenarios', () => {

    test('should handle XSS attempt in login fields', async ({ loginPage }) => {
      await loginPage.navigateTo();
      await loginPage.login('<script>alert("xss")</script>', 'test');

      // Should show error, not execute script
      const message = await loginPage.getFlashMessage();
      expect(message).toContain('Your username is invalid!');
      console.log('✅ XSS attempt was safely handled');
    });

    test('should handle SQL injection attempt', async ({ loginPage }) => {
      await loginPage.navigateTo();
      await loginPage.login("' OR '1'='1", "' OR '1'='1");

      const message = await loginPage.getFlashMessage();
      expect(message).toContain('Your username is invalid!');
      console.log('✅ SQL injection attempt was safely handled');
    });
  });
});
