
import { describe, it, expect } from 'vitest';
import { getErrorResolutionSteps } from '@/utils/error/errorResolution';
import { ErrorCategory } from '@/utils/error/errorClassifier';

describe('getErrorResolutionSteps', () => {
  it('should return default steps for generic errors', () => {
    const steps = getErrorResolutionSteps(ErrorCategory.UNKNOWN);
    
    expect(steps).toHaveLength(3);
    expect(steps[0]).toContain('Retry');
    expect(steps[1]).toContain('Refresh');
    expect(steps[2]).toContain('Restart');
  });
  
  it('should return permission-specific steps for access errors', () => {
    const steps = getErrorResolutionSteps(ErrorCategory.PERMISSION);
    
    expect(steps).toHaveLength(3);
    expect(steps[0]).toContain('Verify your access level');
    expect(steps[1]).toContain('Request access');
    expect(steps[2]).toContain('Try a different resource');
  });
  
  it('should return network-specific steps for timeout errors', () => {
    const steps = getErrorResolutionSteps(ErrorCategory.NETWORK);
    
    expect(steps).toHaveLength(3);
    expect(steps[0]).toContain('internet connection');
    expect(steps[1]).toContain('Reload');
    expect(steps[2]).toContain('server status');
  });
  
  it('should return auth-specific steps for login context', () => {
    const steps = getErrorResolutionSteps(ErrorCategory.AUTHENTICATION);
    
    expect(steps).toHaveLength(3);
    expect(steps[0]).toContain('Refresh your session');
    expect(steps[1]).toContain('Log in again');
    expect(steps[2]).toContain('Clear cookies and cache');
  });
  
  it('should return validation steps for form errors', () => {
    const steps = getErrorResolutionSteps(ErrorCategory.VALIDATION);
    
    expect(steps).toHaveLength(3);
    expect(steps[0]).toContain('Check your input');
    expect(steps[1]).toContain('Format data correctly');
    expect(steps[2]).toContain('Try example data');
  });
  
  it('should handle other error categories with default steps', () => {
    const steps = getErrorResolutionSteps(ErrorCategory.DATABASE);
    
    expect(steps).toHaveLength(3);
    expect(steps[0]).toContain('Retry');
  });
});
