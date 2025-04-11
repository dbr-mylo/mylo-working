
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  backupDocument, 
  getDocumentBackup, 
  verifyAndCleanBackups 
} from '@/utils/backup/documentBackupSystem';
import { 
  generateDocumentChecksum, 
  validateDocumentChecksum, 
  verifyBackupIntegrity 
} from '@/utils/backup/documentIntegrity';
import { UserRole } from '@/lib/types';

describe('Document Backup Edge Cases', () => {
  // Mock localStorage for tests
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      getStore: () => store
    };
  })();
  
  beforeEach(() => {
    // Setup localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // Clear localStorage before each test
    localStorageMock.clear();
    
    // Clear mocks
    vi.clearAllMocks();
  });
  
  describe('Storage Limit Handling', () => {
    it('should handle quota exceeded errors', () => {
      // Mock setItem to throw storage quota error
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('QuotaExceededError: The quota has been exceeded.');
      });
      
      // Attempt to create backup
      const result = backupDocument(
        'Test content',
        'doc123',
        'Test Document',
        'writer' as UserRole
      );
      
      // Verify backup failed but didn't throw
      expect(result).toBe(false);
    });
    
    it('should work with extremely large content', () => {
      // Generate large content (simulated)
      const largeContent = 'A'.repeat(10000);
      
      // Attempt to create backup
      const result = backupDocument(
        largeContent,
        'doc123',
        'Test Document',
        'writer' as UserRole,
        {},
        true // with integrity check
      );
      
      // Verify backup succeeded
      expect(result).toBe(true);
      
      // Verify checksum was created and stored
      const backup = getDocumentBackup('doc123');
      expect(backup).not.toBeNull();
      expect(backup?.meta?.integrity?.checksum).toBeDefined();
    });
  });
  
  describe('Data Corruption Handling', () => {
    it('should detect corrupted content with checksums', () => {
      // Create a backup with integrity check
      backupDocument(
        'Original content',
        'doc123',
        'Test Document',
        'writer' as UserRole,
        {},
        true
      );
      
      // Retrieve the backup
      const backup = getDocumentBackup('doc123');
      expect(backup).not.toBeNull();
      
      // Verify integrity
      const integrityResult = verifyBackupIntegrity(backup!);
      expect(integrityResult.valid).toBe(true);
      expect(integrityResult.status).toBe('valid');
      
      // Simulate corruption by changing stored content
      const backupKey = Object.keys(localStorageMock.getStore()).find(
        key => key.includes('doc_backup_')
      );
      
      if (backupKey) {
        const storedBackup = JSON.parse(localStorageMock.getItem(backupKey)!);
        storedBackup.content = 'Corrupted content';
        localStorageMock.setItem(backupKey, JSON.stringify(storedBackup));
        
        // Re-retrieve backup with corrupted content
        const corruptedBackup = getDocumentBackup('doc123');
        
        // Verify integrity check fails
        const corruptedIntegrityResult = verifyBackupIntegrity(corruptedBackup!);
        expect(corruptedIntegrityResult.valid).toBe(false);
        expect(corruptedIntegrityResult.status).toBe('corrupted');
      }
    });
    
    it('should clean up corrupted backups', () => {
      // Create multiple backups
      backupDocument('Content 1', 'doc1', 'Doc 1', 'writer' as UserRole, {}, true);
      backupDocument('Content 2', 'doc2', 'Doc 2', 'writer' as UserRole, {}, true);
      backupDocument('Content 3', 'doc3', 'Doc 3', 'writer' as UserRole, {}, true);
      
      // Corrupt one backup
      const backupKeys = Object.keys(localStorageMock.getStore()).filter(
        key => key.includes('doc_backup_')
      );
      
      if (backupKeys.length >= 2) {
        const backupToCorrupt = backupKeys[1];
        const storedBackup = JSON.parse(localStorageMock.getItem(backupToCorrupt)!);
        storedBackup.content = 'Corrupted content';
        localStorageMock.setItem(backupToCorrupt, JSON.stringify(storedBackup));
        
        // Run verification and cleanup
        const stats = verifyAndCleanBackups();
        
        // Check stats
        expect(stats.total).toBeGreaterThanOrEqual(3);
        expect(stats.corrupted).toBe(1);
        expect(stats.removed).toBe(1);
        expect(stats.valid).toBe(2);
      }
    });
  });
  
  describe('Edge Content Cases', () => {
    it('should handle empty content gracefully', () => {
      // Try to backup empty content
      const emptyResult = backupDocument(
        '',
        'doc123',
        'Test Document',
        'writer' as UserRole
      );
      
      expect(emptyResult).toBe(false);
      
      // Try to backup whitespace
      const whitespaceResult = backupDocument(
        '   \n  ',
        'doc123',
        'Test Document',
        'writer' as UserRole
      );
      
      expect(whitespaceResult).toBe(false);
    });
    
    it('should generate valid checksums for special characters', () => {
      // Content with special characters
      const specialContent = 'Special 😊 characters & symbols < > " \' $ % ^ * ( )';
      
      // Generate checksum
      const checksum = generateDocumentChecksum(specialContent);
      
      // Verify checksum is valid
      expect(checksum).toBeTruthy();
      expect(typeof checksum).toBe('string');
      
      // Verify validation works
      expect(validateDocumentChecksum(specialContent, checksum)).toBe(true);
      expect(validateDocumentChecksum('modified content', checksum)).toBe(false);
    });
  });
  
  describe('Concurrent Operations', () => {
    it('should handle multiple rapid backup operations', async () => {
      // Create multiple backups in rapid succession
      const results = await Promise.all([
        backupDocument('Content 1', 'doc1', 'Doc 1', 'writer' as UserRole),
        backupDocument('Content 2', 'doc1', 'Doc 1', 'writer' as UserRole),
        backupDocument('Content 3', 'doc1', 'Doc 1', 'writer' as UserRole)
      ]);
      
      // All operations should complete
      expect(results.every(Boolean)).toBe(true);
      
      // Only one backup should exist for doc1
      const backup = getDocumentBackup('doc1');
      expect(backup).not.toBeNull();
      expect(backup?.content).toBe('Content 3');
    });
  });
});
