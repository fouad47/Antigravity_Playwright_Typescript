# Chapter 02: Locator Strategies

## 🎯 Learning Objectives
- Master all Playwright locator strategies
- Understand when to use each locator type
- Build resilient, maintenance-friendly locators
- Chain and filter locators for precision

## 📚 Locator Priority (Best to Worst)
1. **getByRole()** - Most accessible, resilient to DOM changes
2. **getByText()** - Finds by visible text
3. **getByLabel()** - Perfect for form inputs
4. **getByPlaceholder()** - When labels aren't available
5. **getByTestId()** - When other strategies don't work
6. **CSS selectors** - Powerful but brittle
7. **XPath** - Last resort, most brittle

## 📁 Files in This Chapter
| File | Description |
|------|-------------|
| `role-locators.spec.ts` | getByRole with all ARIA roles |
| `text-label-locators.spec.ts` | getByText, getByLabel, getByPlaceholder |
| `css-xpath-locators.spec.ts` | CSS and XPath selectors |
| `chained-filtered-locators.spec.ts` | Advanced: chaining, filtering, nth, parent-child |

## 🏋️ Mini Challenges
1. Find all buttons on the Challenging DOM page using getByRole
2. Create a locator that finds the 3rd link on the home page
3. Chain locators to find a specific cell in a table
4. Use filter to find a link containing specific text

## 🎤 Interview Questions
1. What is the difference between getByRole and getByText?
2. When would you use CSS selectors over getByRole?
3. How does Playwright's locator differ from Selenium's findElement?
4. What makes a locator "resilient"?
5. How do you locate elements inside an iframe?
