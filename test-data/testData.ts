/**
 * ============================================================
 * TEST DATA - Static Test Data
 * ============================================================
 *
 * 📚 LEARNING NOTE:
 * Static test data for deterministic tests.
 * Use Faker (TestDataGenerator) for random data,
 * and this file for fixed, repeatable test scenarios.
 * ============================================================
 */

/**
 * Valid login credentials for the-internet.herokuapp.com.
 */
export const VALID_CREDENTIALS = {
  username: 'tomsmith',
  password: 'SuperSecretPassword!',
} as const;

/**
 * Invalid credentials for negative testing.
 */
export const INVALID_CREDENTIALS = {
  wrongUsername: { username: 'invaliduser', password: 'SuperSecretPassword!' },
  wrongPassword: { username: 'tomsmith', password: 'wrongpassword' },
  emptyCredentials: { username: '', password: '' },
  specialChars: { username: '<script>alert("xss")</script>', password: "'; DROP TABLE users; --" },
} as const;

/**
 * Dropdown options available on /dropdown page.
 */
export const DROPDOWN_OPTIONS = {
  option1: { text: 'Option 1', value: '1' },
  option2: { text: 'Option 2', value: '2' },
} as const;

/**
 * Expected data for the sortable tables page.
 */
export const TABLE_DATA = {
  expectedRowCount: 4,
  columns: ['Last Name', 'First Name', 'Email', 'Due', 'Web Site', 'Action'],
  sampleRow: {
    lastName: 'Smith',
    firstName: 'John',
    email: 'jsmith@gmail.com',
  },
} as const;

/**
 * Key press test data.
 */
export const KEY_PRESS_DATA = [
  { key: 'A', expectedResult: 'You entered: A' },
  { key: 'Enter', expectedResult: 'You entered: ENTER' },
  { key: 'Tab', expectedResult: 'You entered: TAB' },
  { key: 'Space', expectedResult: 'You entered: SPACE' },
  { key: 'Escape', expectedResult: 'You entered: ESCAPE' },
  { key: 'ArrowUp', expectedResult: 'You entered: UP' },
  { key: 'ArrowDown', expectedResult: 'You entered: DOWN' },
] as const;

/**
 * Status codes to test.
 */
export const STATUS_CODES = [200, 301, 404, 500] as const;

/**
 * URLs for various pages on the-internet.herokuapp.com.
 */
export const PAGE_URLS = {
  home: '/',
  login: '/login',
  secure: '/secure',
  checkboxes: '/checkboxes',
  dropdown: '/dropdown',
  dynamicControls: '/dynamic_controls',
  dynamicLoading1: '/dynamic_loading/1',
  dynamicLoading2: '/dynamic_loading/2',
  fileUpload: '/upload',
  fileDownload: '/download',
  hovers: '/hovers',
  jsAlerts: '/javascript_alerts',
  keyPresses: '/key_presses',
  tables: '/tables',
  frames: '/frames',
  iframe: '/iframe',
  nestedFrames: '/nested_frames',
  windows: '/windows',
  dragAndDrop: '/drag_and_drop',
  addRemoveElements: '/add_remove_elements/',
  challengingDom: '/challenging_dom',
  brokenImages: '/broken_images',
  inputs: '/inputs',
  infiniteScroll: '/infinite_scroll',
  notifications: '/notification_message_rendered',
  statusCodes: '/status_codes',
} as const;
