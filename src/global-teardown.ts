/**
 * ============================================================
 * GLOBAL TEARDOWN
 * ============================================================
 *
 * 📚 Global Teardown runs ONCE after all tests complete.
 * Use it for:
 * - Cleaning up test data
 * - Generating summary reports
 * - Sending notifications
 * ============================================================
 */

import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('\n🌍 Global Teardown: Starting...');

  // Clean up temporary files
  const fs = await import('fs');
  const path = await import('path');
  
  const tempDir = path.resolve(process.cwd(), 'test-data', 'downloads');
  if (fs.existsSync(tempDir)) {
    const files = fs.readdirSync(tempDir);
    for (const file of files) {
      if (file.startsWith('dynamic-test-')) {
        fs.unlinkSync(path.join(tempDir, file));
      }
    }
  }

  console.log('🌍 Global Teardown: Complete!\n');
}

export default globalTeardown;
