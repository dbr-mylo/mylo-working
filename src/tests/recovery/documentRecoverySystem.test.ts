
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DocumentRecoveryService } from '@/services/DocumentRecoveryService';
import * as backupSystem from '@/utils/backup/documentBackupSystem';

// Mock the document backup system
vi.mock('@/utils/backup/documentBackupSystem', () => ({
  backupDocument: vi.fn(),
  hasBackup: vi.fn(),
  getDocumentBackup: vi.fn(),
  removeBackup: vi.fn()
}));

describe('DocumentRecoveryService', () => {
  let service: DocumentRecoveryService;
  
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Create a new service instance for each test
    service = new DocumentRecoveryService({
      autoBackupInterval: 1000,
      maxDocumentRevisions: 3
    });
    
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
  
  it('should create a backup when content changes', () => {
    // Mock the backupDocument function to return true
    vi.mocked(backupSystem.backupDocument).mockReturnValue(true);
    
    // Create a backup
    const result = service.createBackup('Test content');
    
    // Check the result
    expect(result).toBe(true);
    
    // Verify the backup was created
    expect(backupSystem.backupDocument).toHaveBeenCalledWith(
      'Test content',
      'test-doc-123',
      'Test Document',
      'writer',
      undefined // No meta data
    );
  });
  
  it('should not create a backup when content has not changed', () => {
    // Mock the backupDocument function to return true
    vi.mocked(backupSystem.backupDocument).mockReturnValue(true);
    
    // Create initial backup
    service.createBackup('Test content');
    
    // Clear the mock to check if it's called again
    vi.mocked(backupSystem.backupDocument).mockClear();
    
    // Try to create another backup with the same content
    const result = service.createBackup('Test content');
    
    // Check the result
    expect(result).toBe(false);
    
    // Verify no backup was created
    expect(backupSystem.backupDocument).not.toHaveBeenCalled();
  });
  
  it('should check if a backup exists', () => {
    // Mock hasBackup to return true
    vi.mocked(backupSystem.hasBackup).mockReturnValue(true);
    
    // Check if a backup exists
    const result = service.hasBackup();
    
    // Verify the result
    expect(result).toBe(true);
    expect(backupSystem.hasBackup).toHaveBeenCalledWith('test-doc-123');
  });
  
  it('should recover a document from backup', () => {
    // Create a mock backup
    const mockBackup = {
      id: 'backup-123',
      documentId: 'test-doc-123',
      title: 'Test Document',
      content: 'Recovered content',
      role: 'writer',
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
    
    // Recover the document
    const result = service.recoverFromBackup();
    
    // Verify the result
    expect(result).toEqual(expect.objectContaining({
      id: 'test-doc-123',
      title: 'Test Document',
      content: 'Recovered content'
    }));
    expect(backupSystem.getDocumentBackup).toHaveBeenCalledWith('test-doc-123');
  });
  
  it('should clear backup after successful save', () => {
    // Mock removeBackup to return true
    vi.mocked(backupSystem.removeBackup).mockReturnValue(true);
    
    // Clear the backup
    const result = service.clearBackup();
    
    // Verify the result
    expect(result).toBe(true);
    expect(backupSystem.removeBackup).toHaveBeenCalledWith('test-doc-123');
  });
  
  it('should handle errors during recovery', () => {
    // Mock getDocumentBackup to throw an error
    vi.mocked(backupSystem.getDocumentBackup).mockImplementation(() => {
      throw new Error('Recovery error');
    });
    
    // Attempt to recover
    const result = service.recoverFromBackup();
    
    // Verify no document was returned
    expect(result).toBeNull();
  });
});
