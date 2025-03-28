
import { describe, it, expect } from 'vitest';
import { getErrorResolutionSteps } from '@/utils/error/errorResolution';

describe('getErrorResolutionSteps', () => {
  it('should return default steps for generic errors', () => {
    const error = new Error('Generic error');
    const context = 'unknown';
    
    const steps = getErrorResolutionSteps(error, context);
    
    expect(steps).toHaveLength(4);
    expect(steps[0]).toContain('Refresh');
    expect(steps[1]).toContain('internet connection');
    expect(steps[2]).toContain('browser cache');
    expect(steps[3]).toContain('contact support');
  });
  
  it('should return permission-specific steps for access errors', () => {
    const error = new Error('Permission denied');
    const context = 'settings';
    
    const steps = getErrorResolutionSteps(error, context);
    
    expect(steps).toHaveLength(3);
    expect(steps[0]).toContain('permissions');
    expect(steps[1]).toContain('logging out');
    expect(steps[2]).toContain('administrator');
  });
  
  it('should return network-specific steps for timeout errors', () => {
    const error = new Error('Request timed out');
    const context = 'api';
    
    const steps = getErrorResolutionSteps(error, context);
    
    expect(steps).toHaveLength(3);
    expect(steps[0]).toContain('internet connection');
    expect(steps[1]).toContain('Try again');
    expect(steps[2]).toContain('VPN');
  });
  
  it('should return auth-specific steps for login context', () => {
    const error = new Error('Authentication failed');
    const context = 'login';
    
    const steps = getErrorResolutionSteps(error, context);
    
    expect(steps).toHaveLength(3);
    expect(steps[0]).toContain('credentials');
    expect(steps[1]).toContain('Reset your password');
    expect(steps[2]).toContain('account is locked');
  });
  
  it('should return document-specific steps for document context', () => {
    const error = new Error('Failed to save document');
    const context = 'document';
    
    const steps = getErrorResolutionSteps(error, context);
    
    expect(steps).toHaveLength(3);
    expect(steps[0]).toContain('unsaved changes');
    expect(steps[1]).toContain('different name');
    expect(steps[2]).toContain('permissions');
  });
  
  it('should handle non-Error objects', () => {
    const stringError = 'Network disconnected';
    const context = 'api';
    
    const steps = getErrorResolutionSteps(stringError, context);
    
    expect(steps).toHaveLength(3);
    expect(steps[0]).toContain('internet connection');
  });
});
