
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DocumentRecoveryService } from '@/services/DocumentRecoveryService';
import * as backupSystem from '@/utils/backup/documentBackupSystem';
import { UserRole } from '@/lib/types';
import { classifyError, ErrorCategory } from '@/utils/error/errorClassifier';
import * as selfHealingSystem from '@/utils/error/selfHealingSystem';

// Mock the document backup system
vi.mock('@/utils/backup/documentBackupSystem', () => ({
  backupDocument: vi.fn(),
  hasBackup: vi.fn(),
  getDocumentBackup: vi.fn(),
  removeBackup: vi.fn()
}));

// Mock self healing system
vi.mock('@/utils/error/selfHealingSystem', () => ({
  registerErrorAndAttemptRecovery: vi.fn(),
  getErrorCategoryInfo: vi.fn(),
  resetRecoveryState: vi.fn()
}));

describe('Complex Document Recovery Scenarios', () => {
  let recoveryService: DocumentRecoveryService;
  let mockBackupData: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Initialize the recovery service
    recoveryService = new DocumentRecoveryService();
    recoveryService.initialize('test-doc-123', 'Test Document', 'writer');
    
    // Create standard mock backup
    mockBackupData = {
      id: 'backup-123',
      documentId: 'test-doc-123',
      title: 'Test Document',
      content: 'Backed up content',
      role: 'writer' as UserRole,
      timestamp: Date.now(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      meta: {
        owner_id: 'user-123',
        version: 1
      }
    };
    
    // Mock successful backup creation
    vi.mocked(backupSystem.backupDocument).mockReturnValue(true);
    
    // Create initial backup
    recoveryService.createBackup('Initial content');
  });
  
  describe('Network Error Recovery Flow', () => {
    it('should recover document after network error during save', () => {
      // Set up mocks for failed save and recovery
      vi.mocked(backupSystem.hasBackup).mockReturnValue(true);
      vi.mocked(backupSystem.getDocumentBackup).mockReturnValue(mockBackupData);
      
      // Create a network error
      const networkError = new Error('Failed to fetch');
      
      // Handle the error
      const result = recoveryService.handleErrorWithRecovery(
        networkError,
        'document.save'
      );
      
      // Verify recovery was successful
      expect(result.recovered).toBe(true);
      expect(result.recoveryDocument).toEqual(
        expect.objectContaining({
          id: 'test-doc-123',
          content: 'Backed up content'
        })
      );
    });
    
    it('should reset after multiple save failures', () => {
      // Set up mocks
      vi.mocked(backupSystem.hasBackup).mockReturnValue(true);
      vi.mocked(backupSystem.getDocumentBackup).mockReturnValue(mockBackupData);
      
      // Simulate 3 consecutive save errors
      const networkError = new Error('Failed to fetch');
      
      // First error
      recoveryService.handleErrorWithRecovery(networkError, 'document.save');
      
      // Second error
      recoveryService.handleErrorWithRecovery(networkError, 'document.save');
      
      // Third error - should trigger self healing system
      recoveryService.handleErrorWithRecovery(networkError, 'document.save');
      
      // Verify self healing system was called
      expect(selfHealingSystem.registerErrorAndAttemptRecovery).toHaveBeenCalledTimes(1);
      expect(selfHealingSystem.registerErrorAndAttemptRecovery).toHaveBeenCalledWith(
        networkError,
        'document.save'
      );
    });
  });
  
  describe('Sequential Error Handling', () => {
    it('should handle different error types in sequence', () => {
      // Set up mocks
      vi.mocked(backupSystem.hasBackup).mockReturnValue(true);
      vi.mocked(backupSystem.getDocumentBackup).mockReturnValue(mockBackupData);
      
      // Create different error types
      const networkError = new Error('Failed to fetch');
      const validationError = new Error('Invalid document format');
      const authError = new Error('Unauthorized');
      
      // Handle network error - should recover
      const networkResult = recoveryService.handleErrorWithRecovery(
        networkError, 
        'document.save'
      );
      expect(networkResult.recovered).toBe(true);
      
      // Handle validation error - should not recover
      const validationResult = recoveryService.handleErrorWithRecovery(
        validationError,
        'document.validate'
      );
      expect(validationResult.recovered).toBe(false);
      
      // Handle auth error - should not recover
      const authResult = recoveryService.handleErrorWithRecovery(
        authError,
        'auth.token'
      );
      expect(authResult.recovered).toBe(false);
      
      // Network error again - should recover
      const secondNetworkResult = recoveryService.handleErrorWithRecovery(
        networkError,
        'document.save'
      );
      expect(secondNetworkResult.recovered).toBe(true);
    });
  });
  
  describe('Content Versioning During Recovery', () => {
    it('should handle recovery with version conflicts', () => {
      // Create multiple versions of backup
      const version1 = { ...mockBackupData, content: 'Version 1 content', meta: { version: 1 } };
      const version2 = { ...mockBackupData, content: 'Version 2 content', meta: { version: 2 } };
      
      // Mock hasBackup
      vi.mocked(backupSystem.hasBackup).mockReturnValue(true);
      
      // First recovery - get version 1
      vi.mocked(backupSystem.getDocumentBackup).mockReturnValueOnce(version1);
      const result1 = recoveryService.recoverFromBackup();
      expect(result1?.content).toBe('Version 1 content');
      expect(result1?.meta?.version).toBe(1);
      
      // Now update the document and create a new backup
      vi.mocked(backupSystem.backupDocument).mockReturnValue(true);
      recoveryService.createBackup('Updated content');
      
      // Second recovery - get version 2
      vi.mocked(backupSystem.getDocumentBackup).mockReturnValueOnce(version2);
      const result2 = recoveryService.recoverFromBackup();
      expect(result2?.content).toBe('Version 2 content');
      expect(result2?.meta?.version).toBe(2);
    });
  });
  
  describe('Auto-Recovery Timing', () => {
    it('should not trigger recovery for non-critical errors', () => {
      // Create a minor error
      const minorError = new Error('Warning: Some fields are not filled');
      
      // Attempt recovery
      const result = recoveryService.handleErrorWithRecovery(
        minorError, 
        'document.validate.warning'
      );
      
      // Should not recover
      expect(result.recovered).toBe(false);
      expect(backupSystem.getDocumentBackup).not.toHaveBeenCalled();
    });
    
    it('should immediately trigger recovery for critical errors', () => {
      // Set up mocks
      vi.mocked(backupSystem.hasBackup).mockReturnValue(true);
      vi.mocked(backupSystem.getDocumentBackup).mockReturnValue(mockBackupData);
      
      // Create a critical error
      const criticalError = new Error('CRITICAL: Document save failure');
      
      // Attempt recovery
      const result = recoveryService.handleErrorWithRecovery(
        criticalError,
        'document.save.critical'
      );
      
      // Should recover immediately
      expect(result.recovered).toBe(true);
      expect(backupSystem.getDocumentBackup).toHaveBeenCalledTimes(1);
    });
  });
});
