
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CircuitBreaker } from '@/utils/error/circuitBreaker';

describe('CircuitBreaker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('should execute function successfully in closed state', async () => {
    const circuitBreaker = new CircuitBreaker();
    const fn = vi.fn().mockResolvedValue('success');
    
    const result = await circuitBreaker.execute(fn);
    
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe('success');
    expect(circuitBreaker.getStatus()).toBe('CLOSED');
  });
  
  it('should open circuit after reaching failure threshold', async () => {
    const circuitBreaker = new CircuitBreaker({ failureThreshold: 2 });
    const error = new Error('Test error');
    const fn = vi.fn().mockRejectedValue(error);
    
    // First failure
    await expect(circuitBreaker.execute(fn)).rejects.toThrow('Test error');
    expect(circuitBreaker.getStatus()).toBe('CLOSED');
    
    // Second failure should open circuit
    await expect(circuitBreaker.execute(fn)).rejects.toThrow('Test error');
    expect(circuitBreaker.getStatus()).toBe('OPEN');
    
    // Subsequent calls should fail fast
    await expect(circuitBreaker.execute(fn)).rejects.toThrow('Service unavailable (circuit breaker open)');
    expect(fn).toHaveBeenCalledTimes(2); // Function not called on third attempt
  });
  
  it('should transition to half-open state after reset timeout', async () => {
    const circuitBreaker = new CircuitBreaker({ 
      failureThreshold: 1, 
      resetTimeout: 1000 
    });
    const error = new Error('Test error');
    const fn = vi.fn().mockRejectedValue(error);
    
    // First failure opens circuit
    await expect(circuitBreaker.execute(fn)).rejects.toThrow('Test error');
    expect(circuitBreaker.getStatus()).toBe('OPEN');
    
    // Advance time past reset timeout
    vi.advanceTimersByTime(1001);
    
    // Next call should transition to half-open and attempt the call
    const successFn = vi.fn().mockResolvedValue('success');
    const result = await circuitBreaker.execute(successFn);
    
    expect(circuitBreaker.getStatus()).toBe('CLOSED');
    expect(successFn).toHaveBeenCalledTimes(1);
    expect(result).toBe('success');
  });
  
  it('should limit calls in half-open state', async () => {
    const circuitBreaker = new CircuitBreaker({ 
      failureThreshold: 1, 
      resetTimeout: 1000,
      halfOpenCalls: 1
    });
    const error = new Error('Test error');
    const fn = vi.fn().mockRejectedValue(error);
    
    // First failure opens circuit
    await expect(circuitBreaker.execute(fn)).rejects.toThrow('Test error');
    expect(circuitBreaker.getStatus()).toBe('OPEN');
    
    // Advance time past reset timeout
    vi.advanceTimersByTime(1001);
    
    // Two parallel requests in half-open state
    const successFn = vi.fn().mockResolvedValue('success');
    const promise1 = circuitBreaker.execute(successFn);
    
    // Second call should be rejected due to half-open call limit
    await expect(circuitBreaker.execute(successFn))
      .rejects.toThrow('Service unavailable (circuit breaker half-open limit reached)');
    
    // First call should succeed
    const result = await promise1;
    expect(result).toBe('success');
    expect(successFn).toHaveBeenCalledTimes(1);
  });
  
  it('should close circuit after successful execution in half-open state', async () => {
    const circuitBreaker = new CircuitBreaker({ 
      failureThreshold: 1, 
      resetTimeout: 1000 
    });
    const error = new Error('Test error');
    const fn = vi.fn().mockRejectedValue(error);
    
    // First failure opens circuit
    await expect(circuitBreaker.execute(fn)).rejects.toThrow('Test error');
    expect(circuitBreaker.getStatus()).toBe('OPEN');
    
    // Advance time past reset timeout
    vi.advanceTimersByTime(1001);
    
    // Successful call in half-open state
    const successFn = vi.fn().mockResolvedValue('success');
    await circuitBreaker.execute(successFn);
    
    // Circuit should be closed
    expect(circuitBreaker.getStatus()).toBe('CLOSED');
    
    // Reset failure count should be 0
    // We can't test this directly as it's private, but we can fail multiple times again
    await expect(circuitBreaker.execute(fn)).rejects.toThrow('Test error');
    expect(circuitBreaker.getStatus()).toBe('CLOSED'); // Still closed after one failure
  });
});
