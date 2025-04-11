
import { describe, it, expect } from 'vitest';
import { 
  classifyError, 
  getUserFriendlyErrorMessage,
  getTechnicalErrorDetails,
  ErrorCategory 
} from '@/utils/error/errorClassifier';

describe('Error Classification System', () => {
  describe('classifyError', () => {
    it('should classify network errors correctly', () => {
      const networkError = new Error('Failed to fetch data');
      const result = classifyError(networkError, 'api.fetchData');
      
      expect(result.category).toBe(ErrorCategory.NETWORK);
      expect(result.message).toContain('trouble connecting');
      expect(result.isRecoverable).toBe(true);
    });
    
    it('should classify authentication errors correctly', () => {
      const authError = new Error('Unauthorized access');
      const result = classifyError(authError, 'auth.login');
      
      expect(result.category).toBe(ErrorCategory.AUTHENTICATION);
      expect(result.message).toContain('session');
      expect(result.isRecoverable).toBe(true);
    });
    
    it('should classify permission errors correctly', () => {
      const permissionError = new Error('Permission denied');
      const result = classifyError(permissionError, 'document.edit');
      
      expect(result.category).toBe(ErrorCategory.PERMISSION);
      expect(result.message).toContain('permission');
      expect(result.isRecoverable).toBe(false);
    });
    
    it('should classify validation errors correctly', () => {
      const validationError = new Error('Invalid data format');
      const result = classifyError(validationError, 'form.submit');
      
      expect(result.category).toBe(ErrorCategory.VALIDATION);
      expect(result.message).toContain('problem with the information');
      expect(result.isRecoverable).toBe(true);
    });
    
    it('should consider context in error classification', () => {
      const error = new Error('Operation failed');
      
      const resultWithAuthContext = classifyError(error, 'auth.login');
      const resultWithDocumentContext = classifyError(error, 'document.save');
      
      expect(resultWithAuthContext.category).not.toBe(resultWithDocumentContext.category);
    });
    
    it('should handle non-Error objects', () => {
      const stringError = 'Something went wrong';
      const result = classifyError(stringError, 'general');
      
      expect(result.category).toBe(ErrorCategory.UNKNOWN);
      expect(result.message).toBeDefined();
      expect(result.technicalMessage).toBe(stringError);
    });
    
    it('should handle errors with HTTP status codes', () => {
      const error = new Error('Not found');
      // @ts-expect-error - Adding status for testing
      error.status = 404;
      
      const result = classifyError(error, 'api.getResource');
      expect(result.category).toBe(ErrorCategory.RESOURCE_NOT_FOUND);
    });
  });
  
  describe('getUserFriendlyErrorMessage', () => {
    it('should return role-specific messages', () => {
      const error = new Error('Database error');
      
      const adminMessage = getUserFriendlyErrorMessage(error, 'database', 'admin');
      const designerMessage = getUserFriendlyErrorMessage(error, 'database', 'designer');
      const writerMessage = getUserFriendlyErrorMessage(error, 'database', 'writer');
      
      expect(adminMessage).not.toBe(designerMessage);
      expect(designerMessage).not.toBe(writerMessage);
      expect(adminMessage).not.toBe(writerMessage);
    });
    
    it('should handle null roles', () => {
      const error = new Error('Authentication failed');
      const message = getUserFriendlyErrorMessage(error, 'auth', null);
      
      expect(message).toBeDefined();
      expect(message.length).toBeGreaterThan(0);
    });
  });
  
  describe('getTechnicalErrorDetails', () => {
    it('should extract details from Error objects', () => {
      const error = new TypeError('Invalid operation');
      const details = getTechnicalErrorDetails(error);
      
      expect(details).toContain('TypeError');
      expect(details).toContain('Invalid operation');
    });
    
    it('should handle non-Error objects', () => {
      const details = getTechnicalErrorDetails('String error');
      expect(details).toBe('String error');
    });
  });
});
