
import { describe, it, expect, vi } from 'vitest';
import { withErrorHandling, withSyncErrorHandling } from '@/utils/error/withErrorHandling';
import { handleError } from '@/utils/error/handleError';
import { beforeEach } from '../testUtils';

// Mock dependencies
vi.mock('@/utils/error/handleError', () => ({
  handleError: vi.fn(),
}));

vi.mock('@/utils/error/withRetry', () => ({
  withRetry: vi.fn(fn => fn()),
}));

describe('withErrorHandling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should call the wrapped async function and return its result', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const wrappedFn = withErrorHandling(fn, 'TestContext');
    
    const result = await wrappedFn(1, 2, 3);
    
    expect(fn).toHaveBeenCalledWith(1, 2, 3);
    expect(result).toBe('success');
    expect(handleError).not.toHaveBeenCalled();
  });
  
  it('should handle errors from the wrapped async function', async () => {
    const error = new Error('Test error');
    const fn = vi.fn().mockRejectedValue(error);
    const wrappedFn = withErrorHandling(fn, 'TestContext', 'Custom message');
    
    const result = await wrappedFn();
    
    expect(fn).toHaveBeenCalled();
    expect(result).toBeUndefined();
    expect(handleError).toHaveBeenCalledWith(error, 'TestContext', 'Custom message');
  });
  
  it('should apply retry logic if config is provided', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const retryConfig = { maxAttempts: 3 };
    const wrappedFn = withErrorHandling(fn, 'TestContext', undefined, retryConfig);
    
    await wrappedFn();
    
    expect(fn).toHaveBeenCalled();
  });
});

describe('withSyncErrorHandling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should call the wrapped sync function and return its result', () => {
    const fn = vi.fn().mockReturnValue('success');
    const wrappedFn = withSyncErrorHandling(fn, 'TestContext');
    
    const result = wrappedFn(1, 2, 3);
    
    expect(fn).toHaveBeenCalledWith(1, 2, 3);
    expect(result).toBe('success');
    expect(handleError).not.toHaveBeenCalled();
  });
  
  it('should handle errors from the wrapped sync function', () => {
    const error = new Error('Test error');
    const fn = vi.fn().mockImplementation(() => {
      throw error;
    });
    const wrappedFn = withSyncErrorHandling(fn, 'TestContext', 'Custom message');
    
    const result = wrappedFn();
    
    expect(fn).toHaveBeenCalled();
    expect(result).toBeUndefined();
    expect(handleError).toHaveBeenCalledWith(error, 'TestContext', 'Custom message');
  });
});
