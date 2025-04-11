
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EnhancedDocumentRecoveryService } from '@/services/EnhancedDocumentRecoveryService';
import * as backupSystem from '@/utils/backup/documentBackupSystem';
import * as selfHealingSystem from '@/utils/error/selfHealingSystem';
import { UserRole } from '@/lib/types';

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
  getErrorAnalytics: vi.fn(),
  resetRecoveryState: vi.fn()
}));

describe('Enhanced Document Recovery Service', () => {
  let service: EnhancedDocumentRecoveryService;
  
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Create a new service instance for each test
    service = new EnhancedDocumentRecoveryService();
    
    // Initialize with test data
    service.initialize(
      'test-doc-123',
      'Test Document',
      'writer',
      vi.fn()
    );
  });
  
  afterEach(() => {
    // Clean up the service
    service.dispose();
  });
  
  describe('Intelligent Backup Features', () => {
    it('should not create redundant backups for identical content', () => {
      // Mock the backupDocument function to return true
      vi.mocked(backupSystem.backupDocument).mockReturnValue(true);
      
      // Create initial backup
      const result1 = service.createBackup('Test content');
      expect(result1).toBe(true);
      expect(backupSystem.backupDocument).toHaveBeenCalledTimes(1);
      
      // Clear the mock counter
      vi.mocked(backupSystem.backupDocument).mockClear();
      
      // Try to create another backup with the same content
      const result2 = service.createBackup('Test content');
      expect(result2).toBe(false);
      expect(backupSystem.backupDocument).not.toHaveBeenCalled();
    });
  });
  
  describe('Enhanced Error Handling', () => {
    it('should track consecutive errors', () => {
      // Mock hasBackup to return true
      vi.mocked(backupSystem.hasBackup).mockReturnValue(true);
      
      // Create a mock backup
      const mockBackup = {
        id: 'backup-123',
        documentId: 'test-doc-123',
        title: 'Test Document',
        content: 'Recovered content',
        role: 'writer' as UserRole,
        timestamp: Date.now(),
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        meta: {
          owner_id: 'user-123',
          version: 1
        }
      };
      
      // Mock getDocumentBackup to return the mock backup
      vi.mocked(backupSystem.getDocumentBackup).mockReturnValue(mockBackup);
      
      // Create an error
      const testError = new Error('Test error');
      
      // Handle the error multiple times
      service.handleErrorWithRecovery(testError, 'document.save');
      service.handleErrorWithRecovery(testError, 'document.save');
      service.handleErrorWithRecovery(testError, 'document.save');
      
      // On third consecutive error, should trigger self-healing
      expect(selfHealingSystem.registerErrorAndAttemptRecovery).toHaveBeenCalledWith(
        testError,
        'document.save'
      );
    });
    
    it('should reset consecutive error count after successful recovery', () => {
      // Mock hasBackup to return true
      vi.mocked(backupSystem.hasBackup).mockReturnValue(true);
      
      // Create a mock backup
      const mockBackup = {
        id: 'backup-123',
        documentId: 'test-doc-123',
        title: 'Test Document',
        content: 'Recovered content',
        role: 'writer' as UserRole,
        timestamp: Date.now(),
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        meta: {
          owner_id: 'user-123',
          version: 1
        }
      };
      
      // Mock getDocumentBackup to return the mock backup
      vi.mocked(backupSystem.getDocumentBackup).mockReturnValue(mockBackup);
      
      // Create an error
      const testError = new Error('Test error');
      
      // Handle the error twice
      service.handleErrorWithRecovery(testError, 'document.save');
      service.handleErrorWithRecovery(testError, 'document.save');
      
      // Should not have called self-healing yet
      expect(selfHealingSystem.registerErrorAndAttemptRecovery).not.toHaveBeenCalled();
      
      // Mock successful recovery
      vi.mocked(backupSystem.getDocumentBackup).mockReturnValue(mockBackup);
      
      // Handle the error a third time, but with successful recovery
      const result = service.handleErrorWithRecovery(testError, 'document.save');
      
      // Verify recovery was successful
      expect(result.recovered).toBe(true);
      
      // Handle the error again - counter should have been reset
      service.handleErrorWithRecovery(testError, 'document.save');
      
      // Self-healing should still not have been called
      expect(selfHealingSystem.registerErrorAndAttemptRecovery).not.toHaveBeenCalled();
    });
  });
  
  describe('Storage Recovery', () => {
    it('should attempt to recover storage when quota is exceeded', () => {
      // Mock backupDocument to throw a quota exceeded error
      vi.mocked(backupSystem.backupDocument).mockImplementationOnce(() => {
        throw new Error('QuotaExceededError: The quota has been exceeded.');
      });
      
      // Mock backupDocument to succeed on second attempt
      vi.mocked(backupSystem.backupDocument).mockImplementationOnce(() => true);
      
      // Mock removeBackup to return true
      vi.mocked(backupSystem.removeBackup).mockReturnValue(true);
      
      // Create a backup with large content
      const largeContent = 'A'.repeat(10000);
      const result = service.createBackup(largeContent);
      
      // Backup should succeed after storage recovery
      expect(result).toBe(true);
      
      // Verify removeBackup was called (storage recovery)
      expect(backupSystem.removeBackup).toHaveBeenCalledWith('test-doc-123');
      
      // Verify backupDocument was called twice (initial attempt + retry after cleanup)
      expect(backupSystem.backupDocument).toHaveBeenCalledTimes(2);
    });
  });
});
