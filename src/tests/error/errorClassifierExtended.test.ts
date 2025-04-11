import { describe, it, expect, vi } from 'vitest';
import { 
  classifyError, 
  getUserFriendlyErrorMessage,
  getTechnicalErrorDetails,
  ErrorCategory,
  ClassifiedError
} from '@/utils/error/errorClassifier';

describe('Error Classification System - Extended Tests', () => {
  describe('error detection accuracy', () => {
    it('should properly detect offline errors', () => {
      const offlineError = new TypeError('Failed to fetch');
      const result = classifyError(offlineError, 'api');
      
      expect(result.category).toBe(ErrorCategory.NETWORK);
      expect(result.message).toContain('trouble connecting');
      expect(result.suggestedAction).toContain('internet connection');
    });
    
    it('should properly detect rate limit errors', () => {
      const rateLimitError = new Error('Too many requests');
      const result = classifyError(rateLimitError, 'api');
      
      expect(result.category).toBe(ErrorCategory.RATE_LIMIT);
      expect(result.message).toContain('too many requests');
    });
    
    it('should handle errors with HTTP status', () => {
      const httpError = new Error('Not found');
      // @ts-expect-error - Adding status for testing
      httpError.status = 404;
      
      const result = classifyError(httpError, 'document');
      expect(result.category).toBe(ErrorCategory.RESOURCE_NOT_FOUND);
    });
    
    it('should handle server errors with HTTP status', () => {
      const serverError = new Error('Server error');
      // @ts-expect-error - Adding status for testing
      serverError.status = 500;
      
      const result = classifyError(serverError, 'api');
      expect(result.category).toBe(ErrorCategory.SERVER);
      expect(result.message).toContain('server');
    });
  });

  describe('context-aware classification', () => {
    it('should use context to enhance classification accuracy', () => {
      const genericError = new Error('Operation failed');
      
      const apiResult = classifyError(genericError, 'api');
      const authResult = classifyError(genericError, 'authentication');
      
      // Same error but different contexts should yield different classifications
      expect(apiResult.category).not.toBe(authResult.category);
    });
  });
  
  describe('technical error details', () => {
    it('should provide detailed technical information for Error objects', () => {
      const error = new TypeError('Invalid operation');
      const details = getTechnicalErrorDetails(error);
      
      expect(details).toContain('TypeError');
      expect(details).toContain('Invalid operation');
    });
    
    it('should handle non-Error objects in technical details', () => {
      const details = getTechnicalErrorDetails('Just a string error');
      expect(details).toBe('Just a string error');
      
      const objDetails = getTechnicalErrorDetails({ message: 'Object error' });
      expect(objDetails).toContain('Object');
    });
  });
  
  describe('role-specific messaging', () => {
    it('should provide admin-specific messages', () => {
      const error = new Error('Database connection failed');
      const message = getUserFriendlyErrorMessage(error, 'database', 'admin');
      
      expect(message).toContain('admin');
      expect(message).toContain('server logs');
    });
    
    it('should handle null and undefined roles', () => {
      const error = new Error('Something went wrong');
      
      const nullMessage = getUserFriendlyErrorMessage(error, 'general', null);
      const undefinedMessage = getUserFriendlyErrorMessage(error, 'general', undefined);
      
      expect(nullMessage).toBeDefined();
      expect(undefinedMessage).toBeDefined();
    });
  });
});
