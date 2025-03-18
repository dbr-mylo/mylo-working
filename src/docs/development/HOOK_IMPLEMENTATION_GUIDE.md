# Hook Implementation Guide

**Last Updated:** 2023-11-25

## Overview

This guide provides best practices for creating, modifying, and testing hooks in our application. Hooks are a critical part of our React architecture and require careful implementation to ensure reliability and maintainability.

## Hook Design Principles

1. **Single Responsibility**
   - Each hook should have a clear, focused purpose
   - A hook should do one thing well
   - Compose complex behavior from simpler hooks

2. **Predictable State Management**
   - State updates should be predictable and transparent
   - Use immutable patterns for state updates
   - Document state transitions

3. **Clean Dependencies**
   - Minimize dependencies to reduce coupling
   - Document all external dependencies
   - Handle dependency changes gracefully

4. **Proper Cleanup**
   - Always clean up side effects
   - Cancel pending operations on unmount
   - Release resources properly

## Creating a New Hook

Follow these steps when creating a new hook:

### 1. Define the Purpose and Interface

Before writing code:

```typescript
// Example hook definition
function useExampleHook(
  param1: string, 
  param2?: number
): {
  value: string;
  setValue: (newValue: string) => void;
  isLoading: boolean;
  error: Error | null;
}
```

### 2. Document the Hook

Create documentation before or alongside implementation:

```markdown
# useExampleHook

**Purpose:** Manages example data with loading and error states.

**Parameters:**
- `param1` (string): Primary identifier for the data
- `param2` (number, optional): Configuration parameter

**Returns:**
- `value` (string): The current value
- `setValue` (function): Updates the value
- `isLoading` (boolean): Indicates loading state
- `error` (Error | null): Any error that occurred

**Behavior:**
1. Initializes with empty value and loading=true
2. Loads data when params change
3. Handles errors during loading
4. Cleans up subscriptions on unmount
```

### 3. Create a Test Implementation

Start with a simple implementation that handles the core functionality:

```typescript
function useExampleHook(param1: string, param2?: number) {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Core functionality
  useEffect(() => {
    // Simple implementation
    // ...
  }, [param1, param2]);

  return { value, setValue, isLoading, error };
}
```

### 4. Add Incremental Functionality

Build up the implementation with full functionality:

```typescript
function useExampleHook(param1: string, param2?: number) {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate data loading
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Replace this with actual data fetching logic
        await new Promise(resolve => setTimeout(resolve, 500));
        setValue(`Data for ${param1}`);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [param1, param2]);
  
  // Add error handling
  const handleError = useCallback((err: Error) => {
    setError(err);
    setIsLoading(false);
  }, []);
  
  // Add advanced features
  const reset = useCallback(() => {
    setValue('');
    setError(null);
    setIsLoading(true);
    // Reset logic
  }, []);
  
  return { value, setValue, isLoading, error };
}
```

### 5. Test the Hook

Write tests that cover the hook's behavior:

```typescript
import { renderHook, act } from '@testing-library/react-hooks';

describe('useExampleHook', () => {
  it('initializes with expected values', () => {
    const { result } = renderHook(() => useExampleHook('test'));
    
    expect(result.current.value).toBe('');
    expect(result.current.isLoading).toBe(true);
  });
  
  it('updates value when setValue is called', () => {
    const { result } = renderHook(() => useExampleHook('test'));
    
    act(() => {
      result.current.setValue('new value');
    });
    
    expect(result.current.value).toBe('new value');
  });
});
```

## Modifying Existing Hooks

When modifying an existing hook:

### 1. Document Current Behavior

```markdown
## Current Behavior

**Hook:** useExampleHook

**Current Functionality:**
- Manages example data
- Handles loading and error states
- Provides value update method

**Known Issues:**
- Doesn't clean up properly on unmount
- Missing error retry functionality
```

### 2. Create a Test Hook

```typescript
// Create a duplicate for testing
function useTestExampleHook(param1: string, param2?: number) {
  // Copy existing implementation
  // ...
  
  // Add your changes
  // ...
}
```

### 3. Implement and Test Changes

Make changes incrementally:

```typescript
function useTestExampleHook(param1: string, param2?: number) {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate data loading
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Replace this with actual data fetching logic
        await new Promise(resolve => setTimeout(resolve, 500));
        setValue(`Data for ${param1}`);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [param1, param2]);
  
  // Add retry functionality
  const retry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    // Retry logic
  }, [value, param1, param2]);
  
  // Fix cleanup
  useEffect(() => {
    // Simulate data loading
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Replace this with actual data fetching logic
        await new Promise(resolve => setTimeout(resolve, 500));
        setValue(`Data for ${param1}`);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    return () => {
      // Proper cleanup
      console.log('Cleaning up effect');
    };
  }, [param1, param2]);
  
  return { value, setValue, isLoading, error, retry };
}
```

### 4. Verify Changes

Test the modified hook against the original to ensure compatibility:

```typescript
describe('useTestExampleHook', () => {
  it('maintains original functionality', () => {
    // Verify core behavior still works
  });
  
  it('implements new retry capability', () => {
    // Test new functionality
  });
  
  it('properly cleans up resources', () => {
    // Test improved cleanup
  });
});
```

### 5. Replace Original Hook

Once verified, replace the original hook with the improved version.

## Common Hook Patterns

### Loading and Error States

```typescript
function useDataFetching<T>(fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await fetchFn();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [fetchFn]);
  
  return { data, isLoading, error };
}
```

### Form State Management

```typescript
function useFormState<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  
  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset
  };
}
```

### Async Operations with Cleanup

```typescript
function useAsyncOperation<T, P extends any[]>(
  asyncFn: (...params: P) => Promise<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: Error) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const execute = useCallback(async (...params: P) => {
    // Clean up previous operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFn(...params);
      
      if (!abortController.signal.aborted) {
        setData(result);
        onSuccess?.(result);
      }
      
      return result;
    } catch (err) {
      if (!abortController.signal.aborted) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      }
      throw err;
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [asyncFn, onSuccess, onError]);
  
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  return {
    execute,
    isLoading,
    error,
    data,
    reset: useCallback(() => {
      setData(null);
      setError(null);
      setIsLoading(false);
    }, [])
  };
}
```

## Troubleshooting Common Hook Issues

### Infinite Loops

If your hook is causing infinite renders:
- Check dependency arrays in useEffect/useCallback
- Ensure state updates don't trigger unnecessary effects
- Use functional updates for state based on previous state

### Memory Leaks

To prevent memory leaks:
- Always clean up subscriptions and timers
- Use isMounted flags for async operations
- Cancel in-flight requests when dependencies change

### Performance Issues

If your hook is causing performance problems:
- Memoize complex calculations with useMemo
- Memoize callback functions with useCallback
- Avoid creating new objects/arrays in render
- Consider using useReducer for complex state

## Testing Hooks

### Basic Test Structure

```typescript
import { renderHook, act } from '@testing-library/react-hooks';

describe('useExampleHook', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useExampleHook('test'));
    
    expect(result.current.value).toBe('');
    expect(result.current.isLoading).toBe(true);
  });
  
  it('updates value when setValue is called', () => {
    const { result } = renderHook(() => useExampleHook('test'));
    
    act(() => {
      result.current.setValue('new value');
    });
    
    expect(result.current.value).toBe('new value');
  });
});
```

### Testing Async Hooks

```typescript
describe('useAsyncHook', () => {
  it('loads data and updates state', async () => {
    // Mock API
    const mockFetch = jest.fn().mockResolvedValue({ data: 'test' });
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useAsyncHook(mockFetch)
    );
    
    // Initial state
    expect(result.current.isLoading).toBe(true);
    
    // Wait for async update
    await waitForNextUpdate();
    
    // Final state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual({ data: 'test' });
  });
});
```
