/**
 * ============================================================
 * ENVIRONMENT CONFIGURATIONS
 * ============================================================
 *
 * 📚 LEARNING NOTE:
 * Different configurations for different environments.
 * Switch between them using the NODE_ENV variable.
 * ============================================================
 */

export interface EnvConfig {
  name: string;
  baseUrl: string;
  apiUrl: string;
  timeout: number;
  retries: number;
}

export const environments: Record<string, EnvConfig> = {
  development: {
    name: 'Development',
    baseUrl: 'https://the-internet.herokuapp.com',
    apiUrl: 'https://the-internet.herokuapp.com',
    timeout: 30000,
    retries: 0,
  },
  staging: {
    name: 'Staging',
    baseUrl: 'https://the-internet.herokuapp.com',
    apiUrl: 'https://the-internet.herokuapp.com',
    timeout: 30000,
    retries: 1,
  },
  production: {
    name: 'Production',
    baseUrl: 'https://the-internet.herokuapp.com',
    apiUrl: 'https://the-internet.herokuapp.com',
    timeout: 60000,
    retries: 2,
  },
};

/**
 * Get environment config based on NODE_ENV.
 */
export function getEnvConfig(): EnvConfig {
  const env = process.env.NODE_ENV || 'development';
  const config = environments[env];
  if (!config) {
    console.warn(`⚠️ Unknown environment: ${env}. Using development.`);
    return environments.development;
  }
  return config;
}
