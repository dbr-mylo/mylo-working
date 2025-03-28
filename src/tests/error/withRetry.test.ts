
import { describe, it, expect, vi, afterEach } from 'vitest';
import { withRetry } from '@/utils/error/withRetry';

describe('withRetry', () => {
  const mockFn = vi.fn();
  const defaultConfig = { maxAttempts: 3, delayMs: 0 };
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('should return result when function succeeds on first try', async () => {
    mockFn.mockResolvedValueOnce('success');
    
    const retryFn = withRetry(mockFn, defaultConfig);
    const result = await retryFn('test');
    
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test');
  });
  
  it('should retry until max attempts when function keeps failing', async () => {
    const error = new Error('Test error');
    mockFn.mockRejectedValue(error);
    
    const retryFn = withRetry(mockFn, defaultConfig);
    await expect(retryFn()).rejects.toThrow('Test error');
    
    expect(mockFn).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });
  
  it('should succeed if function succeeds on a retry', async () => {
    mockFn.mockRejectedValueOnce(new Error('First fail'))
          .mockRejectedValueOnce(new Error('Second fail'))
          .mockResolvedValueOnce('success');
    
    const retryFn = withRetry(mockFn, defaultConfig);
    const result = await retryFn();
    
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(3); // Initial + 2 calls until success
  });
  
  it('should pass all arguments to the function', async () => {
    mockFn.mockResolvedValueOnce('success');
    
    const retryFn = withRetry(mockFn, defaultConfig);
    await retryFn(1, 'test', { key: 'value' });
    
    expect(mockFn).toHaveBeenCalledWith(1, 'test', { key: 'value' });
  });
  
  it('should use custom retry condition if provided', async () => {
    // Only retry if error message contains 'retry'
    const retryCondition = (error: any) => 
      error instanceof Error && error.message.includes('retry');
    
    mockFn.mockRejectedValueOnce(new Error('Should retry'))
          .mockRejectedValueOnce(new Error('not a retry error'))
          .mockResolvedValueOnce('success');
    
    const retryFn = withRetry(mockFn, { 
      ...defaultConfig, 
      retryCondition 
    });
    
    // Should not retry after second error since it doesn't match condition
    await expect(retryFn()).rejects.toThrow('not a retry error');
    
    expect(mockFn).toHaveBeenCalledTimes(2); // Initial + 1 retry
  });
});
