
#!/usr/bin/env node

/**
 * Cache Clearing Utility
 * 
 * This script helps clear TypeScript and Vite build caches
 * to resolve potential issues with stale type definitions.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths to clear
const cachePaths = [
  'node_modules/.vite',
  'node_modules/.cache',
  'dist'
];

// Function to clear caches with an optional callback
function clearCaches(onComplete) {
  console.log('🧹 Starting cache cleanup...');

  // Delete cache directories
  cachePaths.forEach(cachePath => {
    const fullPath = path.resolve(process.cwd(), cachePath);
    
    if (fs.existsSync(fullPath)) {
      try {
        console.log(`Removing: ${cachePath}`);
        
        if (process.platform === 'win32') {
          // Windows needs special handling for directory removal
          execSync(`rmdir /s /q "${fullPath}"`, { stdio: 'inherit' });
        } else {
          // Unix systems
          execSync(`rm -rf "${fullPath}"`, { stdio: 'inherit' });
        }
      } catch (error) {
        console.error(`❌ Failed to remove ${cachePath}:`, error.message);
      }
    } else {
      console.log(`✓ ${cachePath} not found (already clean)`);
    }
  });

  console.log('\n✅ Cache cleanup complete!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run dev');
  console.log('2. If issues persist, try: npm install');
  console.log('\nHappy coding! 🚀');
  
  // Call completion callback if provided
  if (typeof onComplete === 'function') {
    onComplete();
  }
}

// If this script is run directly (not imported)
if (require.main === module) {
  clearCaches();
}

// Export the function for programmatic use
module.exports = { clearCaches };
