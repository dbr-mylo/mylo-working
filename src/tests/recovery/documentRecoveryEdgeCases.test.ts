
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DocumentRecoveryService } from '@/services/DocumentRecoveryService';
import * as backupSystem from '@/utils/backup/documentBackupSystem';
import { UserRole } from '@/lib/types';

// Mock the document backup system
vi.mock('@/utils/backup/documentBackupSystem', () => ({
  backupDocument: vi.fn(),
  hasBackup: vi.fn(),
  getDocumentBackup: vi.fn(),
  removeBackup: vi.fn()
}));

describe('Document Recovery Edge Cases', () => {
  let recoveryService: DocumentRecoveryService;
  
  beforeEach(() => {
    vi.clearAllMocks();
    recoveryService = new DocumentRecoveryService();
    recoveryService.initialize('test-doc-123', 'Test Document', 'writer');
  });
  
  afterEach(() => {
    recoveryService.dispose();
  });

  describe('Storage Constraints', () => {
    it('should handle localStorage quota exceeded errors during backup', () => {
      // Mock backupDocument to simulate storage quota error
      vi.mocked(backupSystem.backupDocument).mockImplementation(() => {
        throw new Error('QuotaExceededError: The quota has been exceeded.');
      });
      
      // Attempt to create backup with large content
      const largeContent = 'A'.repeat(5 * 1024 * 1024); // 5MB of content
      const result = recoveryService.createBackup(largeContent);
      
      // Expect backup creation to fail gracefully
      expect(result).toBe(false);
    });
  });
  
  describe('Corrupted Backups', () => {
    it('should handle corrupted backup data gracefully', () => {
      // Mock hasBackup to return true 
      vi.mocked(backupSystem.hasBackup).mockReturnValue(true);
      
      // Mock getDocumentBackup to return corrupted data that will cause error during parse
      vi.mocked(backupSystem.getDocumentBackup).mockImplementation(() => {
        throw new Error('SyntaxError: Unexpected token in JSON at position 0');
      });
      
      // Attempt to recover 
      const recovered = recoveryService.recoverFromBackup();
      
      // Expect recovery to fail gracefully
      expect(recovered).toBeNull();
      // Verify the service tried to get backup
      expect(backupSystem.getDocumentBackup).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('Multiple Backup Versions', () => {
    it('should recover the most recent backup when multiple versions exist', () => {
      // Mock hasBackup to return true
      vi.mocked(backupSystem.hasBackup).mockReturnValue(true);
      
      // Create mock for newest backup
      const newestBackup = {
        id: 'backup-newest',
        documentId: 'test-doc-123',
        title: 'Test Document',
        content: 'Newest content version',
        role: 'writer' as UserRole,
        timestamp: Date.now(),
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        meta: {
          version: 3
        }
      };
      
      // Mock getDocumentBackup to return newest backup
      vi.mocked(backupSystem.getDocumentBackup).mockReturnValue(newestBackup);
      
      // Recover from backup
      const recovered = recoveryService.recoverFromBackup();
      
      // Expect to get the newest backup
      expect(recovered).not.toBeNull();
      expect(recovered?.content).toBe('Newest content version');
      expect(recovered?.meta?.version).toBe(3);
    });
  });
  
  describe('Recovery Retry Logic', () => {
    it('should retry recovery when initial attempt fails', () => {
      // Mock hasBackup to return true
      vi.mocked(backupSystem.hasBackup).mockReturnValue(true);
      
      // Mock getDocumentBackup to fail on first call then succeed on second
      vi.mocked(backupSystem.getDocumentBackup)
        .mockImplementationOnce(() => {
          throw new Error('Network error');
        })
        .mockImplementationOnce(() => ({
          id: 'backup-retry',
          documentId: 'test-doc-123',
          title: 'Test Document',
          content: 'Recovered after retry',
          role: 'writer' as UserRole,
          timestamp: Date.now(),
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          meta: { retried: true }
        }));
      
      // Force the service to use alternative recovery path
      // @ts-ignore - accessing private method for testing
      recoveryService.recoveryAttempts = 1;
      
      // Recover from backup
      const recovered = recoveryService.recoverFromBackup();
      
      // Expect recovery to succeed after retry
      expect(recovered).not.toBeNull();
      expect(recovered?.content).toBe('Recovered after retry');
      expect(backupSystem.getDocumentBackup).toHaveBeenCalledTimes(2);
    });
  });
  
  describe('Empty and Edge Content Cases', () => {
    it('should not create backup for empty content', () => {
      const result = recoveryService.createBackup('');
      expect(result).toBe(false);
      expect(backupSystem.backupDocument).not.toHaveBeenCalled();
    });
    
    it('should handle whitespace-only content', () => {
      const result = recoveryService.createBackup('    \n   ');
      expect(result).toBe(false);
      expect(backupSystem.backupDocument).not.toHaveBeenCalled();
    });
    
    it('should create backup for minimal valid content', () => {
      vi.mocked(backupSystem.backupDocument).mockReturnValue(true);
      
      const result = recoveryService.createBackup('a');
      
      expect(result).toBe(true);
      expect(backupSystem.backupDocument).toHaveBeenCalledTimes(1);
    });
  });
});
