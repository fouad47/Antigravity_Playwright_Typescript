# 🎭 Playwright TypeScript Mastery - Learning Framework

> A comprehensive, chapter-based learning project for mastering **Playwright with TypeScript**, using [the-internet.herokuapp.com](https://the-internet.herokuapp.com) as the application under test.

## 🎯 Project Overview

This is a **production-style learning repository** designed to teach Playwright from beginner to advanced through hands-on coding. Every concept is demonstrated with working, executable test code targeting a real web application.

### Tech Stack
- **[Playwright](https://playwright.dev/)** - Modern E2E testing framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Playwright Test Runner](https://playwright.dev/docs/test-intro)** - Built-in test runner
- **[Faker.js](https://fakerjs.dev/)** - Realistic test data generation
- **[dotenv](https://www.npmjs.com/package/dotenv)** - Environment configuration

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install browsers
npx playwright install

# 3. Run all tests
npx playwright test

# 4. Run with headed browser (see it in action)
npx playwright test --headed

# 5. Open interactive UI mode
npx playwright test --ui

# 6. View the test report
npx playwright show-report
```

---

## 📁 Project Structure

```
project-root/
├── chapters/                    # 📚 20 chapter-based learning modules
│   ├── chapter01_playwright_setup/
│   ├── chapter02_locators/
│   ├── chapter03_selectors/
│   ├── chapter04_interactions/
│   ├── chapter05_auto_waiting/
│   ├── chapter06_assertions/
│   ├── chapter07_browser_contexts/
│   ├── chapter08_frames_and_windows/
│   ├── chapter09_dropdowns_uploads_alerts/
│   ├── chapter10_tables_and_dynamic_elements/
│   ├── chapter11_waits_and_retries/
│   ├── chapter12_hooks/
│   ├── chapter13_fixtures/
│   ├── chapter14_pom_framework/
│   ├── chapter15_authentication/
│   ├── chapter16_api_testing/
│   ├── chapter17_visual_regression/
│   ├── chapter18_reporting_logging/
│   ├── chapter19_advanced_patterns/
│   └── chapter20_end_to_end_projects/
│
├── src/                         # 🏗️ Framework source code
│   ├── pages/                   # Page Object classes
│   │   ├── BasePage.ts          # Abstract base class
│   │   ├── LoginPage.ts
│   │   ├── CheckboxesPage.ts
│   │   ├── DropdownPage.ts
│   │   └── ... (15+ page objects)
│   ├── components/              # Reusable UI components
│   │   ├── NavigationComponent.ts
│   │   └── TableComponent.ts
│   ├── utils/                   # Utility classes
│   │   ├── Logger.ts            # Singleton logger
│   │   ├── TestDataGenerator.ts # Faker-powered data
│   │   ├── FileHelper.ts
│   │   ├── WaitHelper.ts
│   │   └── ScreenshotHelper.ts
│   ├── fixtures/                # Custom test fixtures
│   │   ├── baseFixtures.ts      # All page object fixtures
│   │   └── authFixtures.ts      # Authentication fixtures
│   ├── api/                     # API testing client
│   │   └── ApiClient.ts
│   └── helpers/                 # Helper utilities
│       └── EnvironmentConfig.ts
│
├── test-data/                   # Test data files
│   ├── testData.ts              # Static test data
│   └── users.json               # JSON test data
│
├── config/                      # Configuration
│   └── environments.ts          # Multi-environment config
│
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json                # TypeScript configuration
├── .env                         # Environment variables
└── package.json                 # Project dependencies
```

---

## 📚 Chapter Guide

### Beginner (Chapters 1-5)
| Chapter | Topic | Key Concepts |
|---------|-------|------|
| 01 | Setup & Config | Installation, project structure, first test |
| 02 | Locators | getByRole, getByText, CSS, XPath, chaining |
| 03 | Selectors | Deep dive, resilience, debugging |
| 04 | Interactions | Click, fill, hover, drag, keyboard, upload |
| 05 | Auto-Waiting | Actionability checks, explicit waits |

### Intermediate (Chapters 6-10)
| Chapter | Topic | Key Concepts |
|---------|-------|------|
| 06 | Assertions | Web-first, generic, soft assertions |
| 07 | Browser Contexts | Isolation, multiple sessions |
| 08 | Frames & Windows | iFrames, nested frames, new tabs |
| 09 | Alerts & Uploads | JS dialogs, file downloads |
| 10 | Tables & Dynamic | Data extraction, sorting, infinite scroll |

### Advanced (Chapters 11-15)
| Chapter | Topic | Key Concepts |
|---------|-------|------|
| 11 | Waits & Retries | expect.poll, expect.toPass, polling |
| 12 | Hooks | beforeAll/Each, afterAll/Each, nesting |
| 13 | Fixtures | Custom fixtures, composition, DI |
| 14 | POM Framework | Full framework usage, OOP patterns |
| 15 | Authentication | Storage state, session reuse, Basic Auth |

### Expert (Chapters 16-20)
| Chapter | Topic | Key Concepts |
|---------|-------|------|
| 16 | API Testing | GET/POST/PUT/DELETE, schema validation |
| 17 | Visual Regression | Screenshot assertions, baselines |
| 18 | Reporting & Logging | Reporters, artifacts, traces |
| 19 | Advanced Patterns | Data-driven, mocking, performance |
| 20 | E2E Capstone | Complete test suites, site audit |

---

## 🏗️ OOP Principles Demonstrated

| Principle | Where It's Used |
|-----------|----------------|
| **Abstraction** | `BasePage` abstract class |
| **Encapsulation** | Private locators in page objects |
| **Inheritance** | All pages extend `BasePage` |
| **Polymorphism** | `TableComponent` with any table |
| **Composition** | `NavigationComponent` in pages |
| **Singleton** | `Logger` class |

---

## 🧪 Running Tests

```bash
# Run a specific chapter
npx playwright test chapters/chapter01_playwright_setup/

# Run by grep pattern
npx playwright test --grep "login"

# Run in specific browser
npx playwright test --project=chromium

# Run in debug mode
npx playwright test --debug

# Run with trace on
npx playwright test --trace on

# Generate report
npx playwright test && npx playwright show-report

# Update visual baselines
npx playwright test --update-snapshots
```

---

## 📊 Coverage of the-internet.herokuapp.com

| Page | Covered | Chapter |
|------|---------|---------|
| Form Authentication | ✅ | 14, 15, 20 |
| Checkboxes | ✅ | 04, 14, 20 |
| Dropdown | ✅ | 04, 14, 20 |
| Dynamic Controls | ✅ | 05, 14, 20 |
| Dynamic Loading | ✅ | 05, 11, 20 |
| Inputs | ✅ | 04, 14, 20 |
| JavaScript Alerts | ✅ | 09, 14, 20 |
| Key Presses | ✅ | 04, 14, 20 |
| File Upload | ✅ | 04, 09 |
| Nested Frames | ✅ | 08, 20 |
| Tables | ✅ | 10, 14, 20 |
| Notifications | ✅ | 11 |
| Drag and Drop | ✅ | 04 |
| Add/Remove Elements | ✅ | 10, 20 |
| Challenging DOM | ✅ | 03 |
| Hovers | ✅ | 04, 14, 20 |
| Multiple Windows | ✅ | 08, 14, 20 |
| Infinite Scroll | ✅ | 10 |
| Status Codes | ✅ | 16, 20 |
| Broken Images | ✅ | 10, 20 |
| Basic Auth | ✅ | 15, 20 |

---

## 📝 License

MIT
