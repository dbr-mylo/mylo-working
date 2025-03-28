
// Common test utilities and setup for test files
import { expect, vi } from 'vitest';
import '@testing-library/jest-dom';

// Add jest-dom like assertions for testing-library
// This is a simplified version for demonstration
export const extendExpect = () => {
  // The extensions are already provided by jest-dom import
  // This function is now mostly for documentation
  console.log('Testing utilities initialized');
};

// Export Vitest functions for consistent usage across tests
export { beforeEach, afterEach } from 'vitest';

// Call this in setup
extendExpect();
