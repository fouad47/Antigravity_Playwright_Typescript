/**
 * ============================================================
 * TEST DATA GENERATOR - Powered by Faker.js
 * ============================================================
 *
 * 📚 LEARNING NOTES:
 * Faker generates realistic but fake test data.
 * This avoids hardcoding test data and makes tests
 * more robust by testing with varied inputs.
 *
 * 💡 BEST PRACTICE:
 * Centralize data generation in a utility class.
 * This makes it easy to change data generation logic
 * without modifying individual tests.
 * ============================================================
 */

import { faker } from '@faker-js/faker';

/**
 * Interface for user test data.
 */
export interface TestUser {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

/**
 * Interface for address test data.
 */
export interface TestAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Test Data Generator using Faker.js.
 *
 * 📚 OOP - STATIC METHODS:
 * Static methods belong to the class, not instances.
 * Call them as TestDataGenerator.generateUser() without 'new'.
 */
export class TestDataGenerator {
  /**
   * Generate a random test user.
   */
  static generateUser(): TestUser {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      username: faker.internet.username({ firstName, lastName }),
      password: faker.internet.password({ length: 12, memorable: true }),
      email: faker.internet.email({ firstName, lastName }),
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
    };
  }

  /**
   * Generate a random address.
   */
  static generateAddress(): TestAddress {
    return {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    };
  }

  /**
   * Generate a random string of specified length.
   */
  static generateRandomString(length: number = 10): string {
    return faker.string.alphanumeric(length);
  }

  /**
   * Generate a random number within a range.
   */
  static generateRandomNumber(min: number = 1, max: number = 100): number {
    return faker.number.int({ min, max });
  }

  /**
   * Generate a random email.
   */
  static generateEmail(): string {
    return faker.internet.email();
  }

  /**
   * Generate a random phone number.
   */
  static generatePhone(): string {
    return faker.phone.number();
  }

  /**
   * Generate a random sentence (useful for text inputs).
   */
  static generateSentence(): string {
    return faker.lorem.sentence();
  }

  /**
   * Generate a random paragraph.
   */
  static generateParagraph(): string {
    return faker.lorem.paragraph();
  }

  /**
   * Generate a random URL.
   */
  static generateUrl(): string {
    return faker.internet.url();
  }

  /**
   * Generate a random date string.
   */
  static generateDate(format: 'iso' | 'short' = 'short'): string {
    const date = faker.date.recent();
    if (format === 'iso') {
      return date.toISOString();
    }
    return date.toLocaleDateString();
  }

  /**
   * Generate multiple users.
   */
  static generateUsers(count: number): TestUser[] {
    return Array.from({ length: count }, () => TestDataGenerator.generateUser());
  }

  /**
   * Generate a random file name with extension.
   */
  static generateFileName(extension: string = 'txt'): string {
    return `${faker.string.alphanumeric(8)}.${extension}`;
  }
}
