
import { describe, it, expect } from 'vitest';
import {
  validateFileForExport,
  validateFileForImport,
  FileErrorType
} from '@/utils/error/fileValidation';
import { ErrorCategory } from '@/utils/error/errorClassifier';

// Mock file for testing
const createMockFile = (name: string, type: string, size: number = 1000) => {
  const file = new File(['test-content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('fileValidation', () => {
  describe('validateFileForImport', () => {
    it('should validate a valid file', () => {
      const file = createMockFile('test.mylo', 'application/json');
      const result = validateFileForImport(file);
      
      expect(result.isValid).toBe(true);
    });
    
    it('should reject file exceeding size limit', () => {
      const largeFile = createMockFile('large.mylo', 'application/json', 15 * 1024 * 1024); // 15MB
      const result = validateFileForImport(largeFile);
      
      expect(result.isValid).toBe(false);
      expect(result.errorType).toBe(FileErrorType.SIZE_EXCEEDED);
    });
    
    it('should reject files with incorrect extension', () => {
      const file = createMockFile('test.txt', 'text/plain');
      const result = validateFileForImport(file);
      
      expect(result.isValid).toBe(false);
      expect(result.errorType).toBe(FileErrorType.INVALID_TYPE);
    });
  });
  
  describe('validateFileForExport', () => {
    it('should validate a valid file type and size', () => {
      const result = validateFileForExport('application/json', 1024 * 1024); // 1MB
      
      expect(result.isValid).toBe(true);
    });
    
    it('should reject unsupported file types', () => {
      const result = validateFileForExport('video/mp4', 1024);
      
      expect(result.isValid).toBe(false);
      expect(result.errorType).toBe(FileErrorType.INVALID_TYPE);
    });
    
    it('should reject files exceeding size limit', () => {
      const result = validateFileForExport('application/json', 20 * 1024 * 1024); // 20MB
      
      expect(result.isValid).toBe(false);
      expect(result.errorType).toBe(FileErrorType.SIZE_EXCEEDED);
    });
  });
});
