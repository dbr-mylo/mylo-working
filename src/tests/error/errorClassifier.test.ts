
import { describe, it, expect } from 'vitest';
import { 
  classifyError, 
  getUserFriendlyErrorMessage,
  ErrorCategory,
  ClassifiedError
} from '@/utils/error/errorClassifier';

describe('errorClassifier', () => {
  describe('classifyError', () => {
    it('should classify network errors correctly', () => {
      const networkError = new Error('Failed to fetch data');
      const result = classifyError(networkError, 'api');
      
      expect(result.category).toBe(ErrorCategory.NETWORK);
      expect(result.recoverable).toBe(true);
      expect(result.message).toContain('trouble connecting');
      expect(result.suggestedAction).toBeTruthy();
    });
    
    it('should classify authentication errors correctly', () => {
      const authError = new Error('Token expired');
      const result = classifyError(authError, 'auth');
      
      expect(result.category).toBe(ErrorCategory.AUTHENTICATION);
      expect(result.message).toContain('session');
      expect(result.suggestedAction).toContain('logging in');
    });
    
    it('should classify permission errors correctly', () => {
      const permissionError = new Error('Access denied');
      const result = classifyError(permissionError, 'document');
      
      expect(result.category).toBe(ErrorCategory.PERMISSION);
      expect(result.recoverable).toBe(false);
      expect(result.message).toContain('permission');
    });
    
    it('should classify validation errors correctly', () => {
      const validationError = new Error('Invalid input format');
      const result = classifyError(validationError, 'form');
      
      expect(result.category).toBe(ErrorCategory.VALIDATION);
      expect(result.recoverable).toBe(true);
      expect(result.message).toContain('problem with the information');
    });
    
    it('should classify format errors correctly', () => {
      const formatError = new Error('Could not parse JSON');
      const result = classifyError(formatError, 'import');
      
      expect(result.category).toBe(ErrorCategory.FORMAT);
      expect(result.message).toContain('incorrect format');
    });
    
    it('should classify timeout errors correctly', () => {
      const timeoutError = new Error('Operation timed out');
      const result = classifyError(timeoutError, 'api');
      
      expect(result.category).toBe(ErrorCategory.TIMEOUT);
      expect(result.message).toContain('took too long');
      expect(result.suggestedAction).toContain('Try again');
    });
    
    it('should handle non-Error objects', () => {
      const stringError = 'Something went wrong';
      const result = classifyError(stringError, 'general');
      
      expect(result.category).toBe(ErrorCategory.UNKNOWN);
      expect(result.technicalMessage).toBe('Something went wrong');
    });
  });
  
  describe('getUserFriendlyErrorMessage', () => {
    it('should return role-specific message for designers', () => {
      const error = new Error('Access denied');
      const message = getUserFriendlyErrorMessage(error, 'document', 'designer');
      
      expect(message).toContain('permission');
      expect(message).toContain('Designers');
    });
    
    it('should return role-specific message for editors', () => {
      const error = new Error('Could not parse JSON');
      const message = getUserFriendlyErrorMessage(error, 'import', 'editor');
      
      expect(message).toContain('format');
      expect(message).toContain('template');
    });
    
    it('should return generic message when no role is provided', () => {
      const error = new Error('Network error');
      const message = getUserFriendlyErrorMessage(error, 'api');
      
      expect(message).toContain('trouble connecting');
    });
  });
});
