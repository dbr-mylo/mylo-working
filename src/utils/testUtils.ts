
/**
 * Simple mock implementation for use in browser-based test environments
 * This provides basic functionality similar to Jest's mocking capabilities
 */

export const createMockFunction = () => {
  const calls: any[][] = [];
  
  const mockFn = (...args: any[]) => {
    calls.push(args);
    return undefined;
  };
  
  mockFn.mock = {
    calls,
    results: calls.map(() => ({ value: undefined })),
    instances: [],
    contexts: [],
    lastCall: calls[calls.length - 1],
  };
  
  return mockFn;
};

/**
 * Basic mock implementation similar to Jest's jest object
 */
export const mockUtils = {
  fn: createMockFunction,
  spyOn: (obj: any, method: string) => {
    const original = obj[method];
    const mock = createMockFunction();
    obj[method] = mock;
    
    return {
      mockRestore: () => {
        obj[method] = original;
      },
      mockImplementation: (impl: Function) => {
        obj[method] = (...args: any[]) => {
          mock(...args);
          return impl(...args);
        };
        obj[method].mock = mock.mock;
        return obj[method];
      },
      mock: mock.mock
    };
  }
};

