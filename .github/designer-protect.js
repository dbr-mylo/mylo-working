
#!/usr/bin/env node
/**
 * Git pre-commit hook to prevent changes to designer files
 * 
 * To install:
 * 1. Copy this file to .git/hooks/pre-commit
 * 2. Make it executable: chmod +x .git/hooks/pre-commit
 */

const { execSync } = require('child_process');
const fs = require('fs');

// List of protected files (designer-specific)
const PROTECTED_FILES = [
  'src/components/design/DesignerStandaloneView.tsx',
  'src/components/design/DesignerSidebar.tsx',
  'src/components/design/typography',
];

// Check if any protected files are being modified
try {
  // Get the list of modified files
  const gitStatus = execSync('git diff --cached --name-only').toString();
  const modifiedFiles = gitStatus.split('\n').filter(Boolean);
  
  // Check if any of the modified files are in the protected list
  const protectedChanges = modifiedFiles.filter(file => {
    return PROTECTED_FILES.some(protected => {
      // Check if the file is exactly the protected file
      // or is inside a protected directory
      return file === protected || file.startsWith(protected + '/');
    });
  });
  
  if (protectedChanges.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', '🚨 ERROR: Attempting to commit changes to protected designer files:');
    protectedChanges.forEach(file => {
      console.error(`  - ${file}`);
    });
    console.error('\nThese files should not be modified as they affect designer functionality.');
    console.error('If you need to make these changes, please use --no-verify to bypass this check,');
    console.error('but be aware that you may be breaking designer functionality.\n');
    process.exit(1);
  }
} catch (error) {
  console.error('Error checking for protected files:', error.message);
  // Don't block the commit if the script fails
  process.exit(0);
}
