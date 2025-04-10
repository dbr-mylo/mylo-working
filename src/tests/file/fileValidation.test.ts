
import { describe, it, expect } from 'vitest';
import {
  validateFileForExport,
  validateFileForImport,
  FileErrorType
} from '@/utils/error/fileValidation';
import { ErrorCategory } from '@/utils/error/errorClassifier';

// Mock document and file objects
const mockDocument = {
  id: 'doc123',
  title: 'Test Document',
  content: 'This is test content',
  updated_at: '2025-01-01T12:00:00Z'
};

describe('fileValidation', () => {
  describe('validateFileForExport', () => {
    it('should validate a valid document', () => {
      const result = validateFileForExport(mockDocument, 'mylo');
      
      expect(result.valid).toBe(true);
      expect(result.size).toBeDefined();
    });
    
    it('should reject empty content', () => {
      const emptyDoc = { ...mockDocument, content: '' };
      const result = validateFileForExport(emptyDoc, 'mylo');
      
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe(FileErrorType.INVALID_CONTENT);
      expect(result.error?.category).toBe(ErrorCategory.VALIDATION);
    });
    
    it('should reject missing title', () => {
      const noTitleDoc = { ...mockDocument, title: '' };
      const result = validateFileForExport(noTitleDoc, 'mylo');
      
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe(FileErrorType.MISSING_REQUIRED_FIELDS);
      expect(result.error?.category).toBe(ErrorCategory.VALIDATION);
    });
    
    it('should reject document exceeding size limit', () => {
      // Mock a very large document
      const largeContent = 'x'.repeat(1024 * 1024 * 20); // 20MB of content
      const largeDoc = { ...mockDocument, content: largeContent };
      
      const result = validateFileForExport(largeDoc, 'pdf');
      
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe(FileErrorType.FILE_TOO_LARGE);
      expect(result.error?.category).toBe(ErrorCategory.STORAGE);
    });
  });
  
  describe('validateFileForImport', () => {
    it('should validate a valid file', () => {
      const file = new File(['test content'], 'test.mylo', { type: 'application/json' });
      const result = validateFileForImport(file, 'mylo', 'writer');
      
      expect(result.valid).toBe(true);
    });
    
    it('should reject file exceeding size limit', () => {
      // Create a large file (mock)
      const largeContent = new ArrayBuffer(1024 * 1024 * 15); // 15MB
      const file = new File([largeContent], 'large.mylo', { type: 'application/json' });
      
      // Mock file.size since we can't actually create a file this large in tests
      Object.defineProperty(file, 'size', {
        value: 1024 * 1024 * 15,
        configurable: true
      });
      
      const result = validateFileForImport(file, 'mylo', 'writer');
      
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe(FileErrorType.FILE_TOO_LARGE);
    });
    
    it('should reject files with incorrect extension', () => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const result = validateFileForImport(file, 'mylo', 'writer');
      
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe(FileErrorType.INVALID_FORMAT);
    });
  });
});
