
import '@testing-library/jest-dom';

declare global {
  // Add Vitest types for custom matchers
  namespace Vi {
    interface JestAssertion<T = any> {
      toBeInTheDocument(): T;
      toHaveAttribute(name: string, value?: string): T;
      toHaveTextContent(text: string | RegExp): T;
      // Add other matchers as needed
    }
  }
}
