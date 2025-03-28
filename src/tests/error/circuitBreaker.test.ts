
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createCircuitBreaker } from '@/utils/error/circuitBreaker';

describe('Circuit Breaker', () => {
  const mockFn = vi.fn();
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('should execute the function when circuit is closed', async () => {
    mockFn.mockResolvedValueOnce('success');
    
    const protectedFn = createCircuitBreaker(mockFn, {
      failureThreshold: 2,
      resetTimeout: 1000
    });
    
    const result = await protectedFn('test');
    
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledWith('test');
  });
  
  it('should open circuit after max failures', async () => {
    const error = new Error('Test error');
    mockFn.mockRejectedValue(error);
    
    const protectedFn = createCircuitBreaker(mockFn, {
      failureThreshold: 2,
      resetTimeout: 1000
    });
    
    // First failure
    await expect(protectedFn()).rejects.toThrow('Test error');
    expect(mockFn).toHaveBeenCalledTimes(1);
    
    // Second failure - should open circuit
    await expect(protectedFn()).rejects.toThrow('Test error');
    expect(mockFn).toHaveBeenCalledTimes(2);
    
    // Circuit open - should throw CircuitOpenError without calling function
    vi.clearAllMocks();
    await expect(protectedFn()).rejects.toThrow('Service unavailable');
    expect(mockFn).not.toHaveBeenCalled();
  });
  
  it('should reset circuit after timeout', async () => {
    const mockTime = vi.spyOn(global.Date, 'now');
    mockFn.mockRejectedValueOnce(new Error('Test error'))
          .mockRejectedValueOnce(new Error('Test error'))
          .mockResolvedValueOnce('success');
    
    // Start with current time
    const now = Date.now();
    mockTime.mockReturnValue(now);
    
    const protectedFn = createCircuitBreaker(mockFn, {
      failureThreshold: 2,
      resetTimeout: 1000
    });
    
    // Trigger failures to open circuit
    await expect(protectedFn()).rejects.toThrow('Test error');
    await expect(protectedFn()).rejects.toThrow('Test error');
    
    // Circuit open - should reject without calling
    vi.clearAllMocks();
    await expect(protectedFn()).rejects.toThrow('Service unavailable');
    expect(mockFn).not.toHaveBeenCalled();
    
    // Time travel past reset timeout
    mockTime.mockReturnValue(now + 1001);
    
    // Circuit should be half-open and try again
    const result = await protectedFn();
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
    
    mockTime.mockRestore();
  });
});
