# Chapter 01: Playwright Setup & Configuration

## 🎯 Learning Objectives
- Install Playwright with TypeScript
- Understand project structure
- Configure Playwright for testing
- Run your first test
- Understand the test lifecycle

## 📚 What You'll Learn
1. **Installation**: How to set up a Playwright project from scratch
2. **Configuration**: Understanding `playwright.config.ts`
3. **First Test**: Writing and running your first Playwright test
4. **Test Structure**: The anatomy of a Playwright test file
5. **CLI Commands**: Essential Playwright CLI commands

## 🏗️ Project Setup Steps

```bash
# 1. Create a new directory
mkdir playwright-project && cd playwright-project

# 2. Initialize npm project
npm init -y

# 3. Install Playwright
npm install -D @playwright/test typescript @types/node

# 4. Install browser binaries
npx playwright install

# 5. Create TypeScript config
npx tsc --init
```

## 📁 Files in This Chapter
| File | Description |
|------|-------------|
| `first-test.spec.ts` | Your very first Playwright test |
| `test-structure.spec.ts` | Demonstrates test file anatomy |
| `configuration-demo.spec.ts` | Shows configuration options in action |

## 🧪 Running Tests
```bash
# Run all tests in this chapter
npx playwright test chapters/chapter01_playwright_setup/

# Run in headed mode (see the browser)
npx playwright test chapters/chapter01_playwright_setup/ --headed

# Run with debug mode (step through)
npx playwright test chapters/chapter01_playwright_setup/ --debug

# Open the UI mode
npx playwright test chapters/chapter01_playwright_setup/ --ui
```

## 💡 Key Takeaways
- Playwright tests use `test()` and `expect()` from `@playwright/test`
- Tests auto-wait for elements before interacting
- The `page` fixture provides a fresh browser tab for each test
- Configuration in `playwright.config.ts` controls all test behavior

## 🏋️ Mini Challenges
1. Modify the first test to navigate to a different page on the-internet.herokuapp.com
2. Add a new test that checks the page title
3. Run the tests in headed mode and observe the browser
4. Try running tests in different browsers using `--project`

## 🎤 Interview Questions
1. What is Playwright and how does it differ from Selenium?
2. What browsers does Playwright support?
3. What is the purpose of `playwright.config.ts`?
4. How do you run Playwright tests in different browsers?
5. What is auto-waiting in Playwright?
