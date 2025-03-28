
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withRetry } from '@/utils/error/withRetry';

describe('withRetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the timers for each test
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('should return result of successful function', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    
    const result = await withRetry(fn);
    
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe('success');
  });
  
  it('should retry failed function up to maxAttempts', async () => {
    const error = new Error('Test error');
    const fn = vi.fn()
      .mockRejectedValueOnce(error)
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('success');
    
    const result = await withRetry(fn, { maxAttempts: 3, baseDelay: 100 });
    
    // Advance timers for each retry
    vi.advanceTimersByTime(100);
    vi.advanceTimersByTime(200);
    
    expect(fn).toHaveBeenCalledTimes(3);
    expect(result).toBe('success');
  });
  
  it('should throw error after exhausting all retry attempts', async () => {
    const error = new Error('Test error');
    const fn = vi.fn().mockRejectedValue(error);
    
    await expect(withRetry(fn, { maxAttempts: 2, baseDelay: 100 }))
      .rejects.toThrow('Test error');
    
    // Advance timers for retry
    vi.advanceTimersByTime(100);
    
    expect(fn).toHaveBeenCalledTimes(2);
  });
  
  it('should use exponential backoff if configured', async () => {
    const consoleSpy = vi.spyOn(console, 'info');
    const error = new Error('Test error');
    const fn = vi.fn()
      .mockRejectedValueOnce(error)
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('success');
    
    const retryPromise = withRetry(fn, {
      maxAttempts: 3,
      baseDelay: 100,
      useExponentialBackoff: true
    });
    
    // First retry should be after baseDelay
    vi.advanceTimersByTime(100);
    
    // Second retry should be after baseDelay * 2^1
    vi.advanceTimersByTime(200);
    
    await retryPromise;
    
    expect(fn).toHaveBeenCalledTimes(3);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Retrying in 100ms'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Retrying in 200ms'));
  });
  
  it('should not retry if isRetryable returns false', async () => {
    const error = new Error('Not retryable');
    const fn = vi.fn().mockRejectedValue(error);
    const isRetryable = vi.fn().mockReturnValue(false);
    
    await expect(withRetry(fn, { 
      maxAttempts: 3, 
      baseDelay: 100,
      isRetryable 
    })).rejects.toThrow('Not retryable');
    
    expect(fn).toHaveBeenCalledTimes(1);
    expect(isRetryable).toHaveBeenCalledWith(error);
  });
});
