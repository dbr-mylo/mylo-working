
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  backupDocument,
  hasBackup,
  getDocumentBackup,
  removeBackup
} from '@/utils/backup/documentBackupSystem';

describe('documentBackupSystem', () => {
  // Mock localStorage
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
      })
    };
  })();
  
  // Set up localStorage mock before each test
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // Clear localStorage before each test
    localStorageMock.clear();
    
    // Clear mocks
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  describe('backupDocument', () => {
    it('should successfully back up a document', () => {
      const result = backupDocument(
        'Test content',
        'doc123',
        'Test Document',
        'writer'
      );
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
    
    it('should not back up empty content', () => {
      const result = backupDocument(
        '',
        'doc123',
        'Test Document',
        'writer'
      );
      
      expect(result).toBe(false);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
    
    it('should update existing backup if document ID matches', () => {
      // First backup
      backupDocument(
        'Initial content',
        'doc123',
        'Test Document',
        'writer'
      );
      
      // Update backup
      const result = backupDocument(
        'Updated content',
        'doc123',
        'Test Document',
        'writer'
      );
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
      
      // Check that the backup was updated
      const backups = JSON.parse(localStorageMock.getItem('mylo-document-backups') as string);
      expect(backups.length).toBe(1);
      expect(backups[0].content).toBe('Updated content');
    });
    
    it('should handle localStorage errors', () => {
      // Mock a localStorage error
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      const result = backupDocument(
        'Test content',
        'doc123',
        'Test Document',
        'writer'
      );
      
      expect(result).toBe(false);
    });
  });
  
  describe('hasBackup', () => {
    it('should return true if backup exists for document ID', () => {
      // Create a backup
      backupDocument(
        'Test content',
        'doc123',
        'Test Document',
        'writer'
      );
      
      const result = hasBackup('doc123');
      expect(result).toBe(true);
    });
    
    it('should return true if backup exists for role', () => {
      // Create a backup without document ID
      backupDocument(
        'Test content',
        null,
        'Test Document',
        'designer'
      );
      
      const result = hasBackup(null, 'designer');
      expect(result).toBe(true);
    });
    
    it('should return false if no backups exist', () => {
      const result = hasBackup('nonexistent');
      expect(result).toBe(false);
    });
  });
  
  describe('getDocumentBackup', () => {
    it('should retrieve backup by document ID', () => {
      // Create a backup
      backupDocument(
        'Test content',
        'doc123',
        'Test Document',
        'writer'
      );
      
      const backup = getDocumentBackup('doc123');
      expect(backup).not.toBeNull();
      expect(backup?.content).toBe('Test content');
      expect(backup?.title).toBe('Test Document');
    });
    
    it('should retrieve most recent backup by role', () => {
      // Create multiple backups for the same role
      backupDocument(
        'Old content',
        null,
        'Old Document',
        'writer'
      );
      
      // Mock date to simulate different timestamps
      const realDate = Date;
      const mockDate = new Date(2025, 0, 2);
      global.Date = class extends Date {
        constructor() {
          super();
          return mockDate;
        }
        static now() {
          return mockDate.getTime();
        }
        toISOString() {
          return mockDate.toISOString();
        }
      } as any;
      
      backupDocument(
        'New content',
        null,
        'New Document',
        'writer'
      );
      
      // Restore real Date
      global.Date = realDate;
      
      const backup = getDocumentBackup(null, 'writer');
      expect(backup).not.toBeNull();
      expect(backup?.content).toBe('New content');
      expect(backup?.title).toBe('New Document');
    });
    
    it('should return null if no backup found', () => {
      const backup = getDocumentBackup('nonexistent');
      expect(backup).toBeNull();
    });
  });
  
  describe('removeBackup', () => {
    it('should remove a backup by document ID', () => {
      // Create backups
      backupDocument(
        'Content 1',
        'doc123',
        'Document 1',
        'writer'
      );
      backupDocument(
        'Content 2',
        'doc456',
        'Document 2',
        'writer'
      );
      
      const result = removeBackup('doc123');
      expect(result).toBe(true);
      
      // Verify backup was removed
      const backups = JSON.parse(localStorageMock.getItem('mylo-document-backups') as string);
      expect(backups.length).toBe(1);
      expect(backups[0].id).toBe('doc456');
    });
    
    it('should return false if backup not found', () => {
      const result = removeBackup('nonexistent');
      expect(result).toBe(false);
    });
  });
});
