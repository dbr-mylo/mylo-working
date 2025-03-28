
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackError } from '@/utils/error/analytics';

describe('trackError', () => {
  // Spy on console.info
  const consoleInfoSpy = vi.spyOn(console, 'info');
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should log error tracking message to console', () => {
    const error = new Error('Test error');
    const context = 'TestContext';
    
    trackError(error, context);
    
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error tracked in TestContext'),
      expect.stringContaining('Test error')
    );
  });
  
  it('should log analytics data structure', () => {
    const error = new Error('Test error');
    const context = 'TestContext';
    
    trackError(error, context);
    
    // Second call to console.info should contain analytics data
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      '[Analytics] Error data:',
      expect.objectContaining({
        context: 'TestContext',
        errorType: 'Error',
        message: 'Test error',
        stack: expect.any(String)
      })
    );
  });
  
  it('should handle non-Error objects', () => {
    const stringError = 'String error';
    const context = 'TestContext';
    
    trackError(stringError, context);
    
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error tracked in TestContext'),
      expect.stringContaining('String error')
    );
    
    // Check analytics data for string error
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      '[Analytics] Error data:',
      expect.objectContaining({
        context: 'TestContext',
        errorType: 'Unknown',
        message: 'String error'
      })
    );
  });
});
