# Walkthrough: Playwright TypeScript Mastery Framework

## Summary
Built a complete **Playwright with TypeScript learning framework** with **20 chapters**, **70+ files**, covering beginner to advanced topics using [the-internet.herokuapp.com](https://the-internet.herokuapp.com) as the test application.

## What Was Built

### Framework Core (`src/`)
- **15+ Page Objects** extending an abstract `BasePage` class
- **2 Component Objects** (Navigation, Table) for reusable UI components
- **5 Utility Classes** (Logger, TestDataGenerator, FileHelper, WaitHelper, ScreenshotHelper)
- **3 Fixture Files** (base fixtures, auth fixtures, barrel export)
- **1 API Client** for REST API testing
- **Environment config** with dotenv support

### 20 Learning Chapters
Each chapter includes a README with learning objectives, challenges, and interview questions, plus working spec files:

| Chapter | Files | Topics Covered |
|---------|-------|----------------|
| 01 | 3 specs | Setup, first test, test structure, configuration |
| 02 | 4 specs | getByRole, getByText, CSS, XPath, chaining, filtering |
| 03 | 1 spec | Selector deep dive, resilience, debugging |
| 04 | 5 specs | Click, fill, checkbox, dropdown, hover, drag, keyboard, upload |
| 05 | 1 spec | Auto-waiting, actionability, explicit waits |
| 06 | 1 spec | Web-first, generic, soft assertions |
| 07 | 1 spec | Browser context isolation, multiple sessions |
| 08 | 2 specs | iFrames, nested frames, new windows/tabs |
| 09 | 1 spec | JS alerts/confirm/prompt, file downloads |
| 10 | 1 spec | Table extraction, sorting, dynamic elements, broken images |
| 11 | 1 spec | Waits, retries, expect.poll, expect.toPass |
| 12 | 1 spec | beforeAll/Each, afterAll/Each, nesting, test.step |
| 13 | 1 spec | Custom fixtures, composition, dependency injection |
| 14 | 2 specs | Full POM framework usage, OOP patterns |
| 15 | 1 spec | Storage state, session reuse, Basic Auth |
| 16 | 1 spec | GET/POST/PUT/DELETE, API+UI integration |
| 17 | 1 spec | Screenshot assertions, baselines, element captures |
| 18 | 1 spec | Reporters, artifacts, traces, video recording |
| 19 | 2 specs | Data-driven testing, network interception, mocking |
| 20 | 2 specs | Capstone: login flow E2E, full site audit |

### OOP Principles Demonstrated
- **Abstraction**: `BasePage` abstract class with abstract `path` property
- **Encapsulation**: Private locators, public actions, protected helpers
- **Inheritance**: All page objects extend `BasePage`
- **Polymorphism**: `TableComponent` works with any table locator
- **Composition**: `NavigationComponent` composed into pages
- **Singleton**: `Logger` with `getInstance()`

## Testing
- Smoke test ran: **6/6 tests passed** on Chapter 01
- All tests target live https://the-internet.herokuapp.com

## How to Use
```bash
npm install
npx playwright install
npx playwright test --project=chromium --headed
```
