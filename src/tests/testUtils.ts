
// Common test utilities and setup for test files

import { vi } from 'vitest';

// Re-export vitest functions to make them available in tests
export const beforeEach = vi.beforeEach;
export const afterEach = vi.afterEach;
export const beforeAll = vi.beforeAll;
export const afterAll = vi.afterAll;

// Add jest-dom like assertions for testing-library
// This is a simplified version for demonstration
export const extendExpect = () => {
  expect.extend({
    toBeInTheDocument(received) {
      const pass = Boolean(received);
      return {
        message: () => `expected ${received} ${pass ? 'not ' : ''}to be in the document`,
        pass,
      };
    },
  });
};

// Call this in setup
extendExpect();
