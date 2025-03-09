
import { vi, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import '@testing-library/jest-dom';

// Extend Vitest matchers with jest-dom
expect.extend({});

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Suppress console.error during tests
console.error = vi.fn();
