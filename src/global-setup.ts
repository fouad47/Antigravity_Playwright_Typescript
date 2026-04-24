/**
 * ============================================================
 * GLOBAL SETUP
 * ============================================================
 *
 * 📚 Global Setup runs ONCE before all tests.
 * Use it for:
 * - Seeding test data
 * - Creating shared authentication state
 * - Verifying the application is running
 * ============================================================
 */

import { FullConfig, request } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('\n🌍 Global Setup: Starting...');

  // Verify the application is accessible
  const baseURL = config.projects[0].use.baseURL || 'https://the-internet.herokuapp.com';
  
  try {
    const context = await request.newContext();
    const response = await context.get(baseURL);
    
    if (response.ok()) {
      console.log(`✅ Application is accessible at ${baseURL}`);
    } else {
      console.log(`⚠️ Application returned status ${response.status()}`);
    }
    
    await context.dispose();
  } catch (error) {
    console.error(`❌ Cannot reach application at ${baseURL}`);
    console.error('   Make sure the application is running!');
    throw error;
  }

  // Create test data directory
  const fs = await import('fs');
  const dirs = ['test-data', 'test-data/downloads', 'screenshots', 'videos', 'logs'];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  console.log('🌍 Global Setup: Complete!\n');
}

export default globalSetup;
