
import { describe, it, expect } from 'vitest';
import { getRoleSpecificErrorMessage } from '@/utils/error/roleSpecificErrors';

describe('getRoleSpecificErrorMessage', () => {
  it('should return designer-specific message for designer role', () => {
    const error = new Error('Test error');
    const role = 'designer';
    const context = 'TextEditor';
    
    const message = getRoleSpecificErrorMessage(error, role, context);
    
    expect(message).toContain('Design error in TextEditor');
    expect(message).toContain('Test error');
    expect(message).toContain('style configurations');
  });
  
  it('should return writer-specific message for writer role', () => {
    const error = new Error('Test error');
    const role = 'writer';
    const context = 'DocumentEditor';
    
    const message = getRoleSpecificErrorMessage(error, role, context);
    
    expect(message).toContain('Content error in DocumentEditor');
    expect(message).toContain('Test error');
    expect(message).toContain('content is still safe');
  });
  
  it('should return admin-specific message for admin role', () => {
    const error = new Error('Test error');
    const role = 'admin';
    const context = 'SystemSettings';
    
    const message = getRoleSpecificErrorMessage(error, role, context);
    
    expect(message).toContain('System error in SystemSettings');
    expect(message).toContain('Test error');
    expect(message).toContain('Technical details have been logged');
  });
  
  it('should return generic message for other roles', () => {
    const error = new Error('Test error');
    const role = 'guest';
    const context = 'Page';
    
    const message = getRoleSpecificErrorMessage(error, role, context);
    
    expect(message).toBe('Error in Page: Test error');
  });
  
  it('should handle null or undefined roles', () => {
    const error = new Error('Test error');
    const context = 'Page';
    
    // Test with null
    expect(getRoleSpecificErrorMessage(error, null, context))
      .toBe('Error in Page: Test error');
      
    // Test with undefined
    expect(getRoleSpecificErrorMessage(error, undefined, context))
      .toBe('Error in Page: Test error');
  });
  
  it('should handle non-Error objects', () => {
    const stringError = 'String error';
    const objectError = { message: 'Object error' };
    const context = 'Page';
    
    // Test with string error
    expect(getRoleSpecificErrorMessage(stringError, 'admin', context))
      .toContain('String error');
      
    // Test with object error
    expect(getRoleSpecificErrorMessage(objectError, 'admin', context))
      .toContain('Object error');
  });
});
