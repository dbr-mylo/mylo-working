
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Set up any global mocks or configuration here
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', state: {} }),
  };
});
