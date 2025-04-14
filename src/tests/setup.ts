
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();

// Mock window.location
const locationMock = {
  pathname: '/',
  search: '',
  hash: '',
  host: 'localhost',
  hostname: 'localhost',
  port: '3000',
  protocol: 'http:',
  origin: 'http://localhost:3000',
  href: 'http://localhost:3000/',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn()
};

// Mock performance API
const performanceMock = {
  now: vi.fn().mockReturnValue(100)
};

// Define mocks globally
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'location', { value: locationMock });
Object.defineProperty(window, 'performance', { value: performanceMock });

// Mock console methods to reduce test noise
console.info = vi.fn();
console.warn = vi.fn();
console.error = vi.fn();

// Clean up mocks
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});

// You can add more global test setup configuration here
