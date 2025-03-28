
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global test setup
global.afterEach = vi.afterEach;
global.beforeEach = vi.beforeEach;
global.beforeAll = vi.beforeAll;
global.afterAll = vi.afterAll;

// Set up any global mocks or configuration here
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', state: {} }),
  };
});
