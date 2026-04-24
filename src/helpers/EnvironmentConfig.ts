/**
 * ============================================================
 * ENVIRONMENT CONFIGURATION HELPER
 * ============================================================
 *
 * 📚 LEARNING NOTE:
 * Centralizes all environment-related configuration.
 * Provides type-safe access to environment variables
 * with default values and validation.
 * ============================================================
 */

import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Environment configuration interface.
 */
export interface EnvironmentConfig {
  baseUrl: string;
  apiBaseUrl: string;
  testUsername: string;
  testPassword: string;
  headless: boolean;
  slowMo: number;
  screenshotOnFailure: boolean;
  videoOnFailure: boolean;
  nodeEnv: string;
}

/**
 * Get the current environment configuration.
 *
 * 📚 BEST PRACTICE:
 * Always provide default values for environment variables.
 * This makes the project work out of the box without .env.
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  return {
    baseUrl: process.env.BASE_URL || 'https://the-internet.herokuapp.com',
    apiBaseUrl: process.env.API_BASE_URL || 'https://the-internet.herokuapp.com',
    testUsername: process.env.TEST_USERNAME || 'tomsmith',
    testPassword: process.env.TEST_PASSWORD || 'SuperSecretPassword!',
    headless: process.env.HEADLESS !== 'false',
    slowMo: parseInt(process.env.SLOW_MO || '0', 10),
    screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE !== 'false',
    videoOnFailure: process.env.VIDEO_ON_FAILURE !== 'false',
    nodeEnv: process.env.NODE_ENV || 'test',
  };
}

/**
 * Validate required environment variables are set.
 */
export function validateEnvironment(): void {
  const required = ['BASE_URL'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missing.join(', ')}`);
    console.warn('Using default values. Copy .env.example to .env for customization.');
  }
}

// Export a singleton config object
export const envConfig = getEnvironmentConfig();
