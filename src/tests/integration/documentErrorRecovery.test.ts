
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DocumentRecoveryService } from '@/services/DocumentRecoveryService';
import { classifyError, ErrorCategory } from '@/utils/error/errorClassifier';
import * as backupSystem from '@/utils/backup/documentBackupSystem';
import { UserRole } from '@/lib/types';

// Mock the document backup system
vi.mock('@/utils/backup/documentBackupSystem', () => ({
  backupDocument: vi.fn(),
  hasBackup: vi.fn(),
  getDocumentBackup: vi.fn(),
  removeBackup: vi.fn()
}));

describe('Document Error Recovery Integration', () => {
  let recoveryService: DocumentRecoveryService;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Initialize the recovery service
    recoveryService = new DocumentRecoveryService();
    recoveryService.initialize('test-doc-123', 'Test Document', 'writer');
    
    // Mock successful backup creation
    vi.mocked(backupSystem.backupDocument).mockReturnValue(true);
    
    // Create initial backup
    recoveryService.createBackup('Initial content');
  });
  
  it('should recover document data when a network error occurs during save', () => {
    // Mock backup availability
    vi.mocked(backupSystem.hasBackup).mockReturnValue(true);
    
    // Mock backup retrieval
    const mockBackup = {
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
    vi.mocked(backupSystem.getDocumentBackup).mockReturnValue(mockBackup);
    
    // Create a network error
    const networkError = new Error('Failed to fetch');
    
    // Simulate error handling with recovery
    const { recovered, recoveryDocument } = recoveryService.handleErrorWithRecovery(
      networkError, 
      'document.save'
    );
    
    // Verify recovery was successful
    expect(recovered).toBe(true);
    expect(recoveryDocument).toEqual(expect.objectContaining({
      id: 'test-doc-123', 
      title: 'Test Document',
      content: 'Backed up content'
    }));
    
    // Verify backup was checked and retrieved
    expect(backupSystem.hasBackup).toHaveBeenCalledWith('test-doc-123');
    expect(backupSystem.getDocumentBackup).toHaveBeenCalledWith('test-doc-123');
  });
  
  it('should not attempt recovery for validation errors', () => {
    // Mock backup availability
    vi.mocked(backupSystem.hasBackup).mockReturnValue(true);
    
    // Create a validation error
    const validationError = new Error('Invalid document format');
    
    // Simulate error handling with recovery
    const { recovered } = recoveryService.handleErrorWithRecovery(
      validationError,
      'document.validate'
    );
    
    // Verification recovery was not attempted
    expect(recovered).toBe(false);
    
    // The classify function will be called but no recovery should happen
    expect(backupSystem.getDocumentBackup).not.toHaveBeenCalled();
  });
  
  it('should integrate correctly with error classification system', () => {
    // Create various error types
    const networkError = new Error('Failed to connect');
    const serverError = new Error('Internal server error');
    const authError = new Error('Unauthorized access');
    
    // Mock backup availability
    vi.mocked(backupSystem.hasBackup).mockReturnValue(true);
    
    // Mock backup retrieval
    const mockBackup = {
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
    vi.mocked(backupSystem.getDocumentBackup).mockReturnValue(mockBackup);
    
    // Test network error recovery
    const networkResult = recoveryService.handleErrorWithRecovery(
      networkError,
      'document.save'
    );
    expect(networkResult.recovered).toBe(true);
    
    // Test server error recovery
    const serverResult = recoveryService.handleErrorWithRecovery(
      serverError,
      'document.save'
    );
    expect(serverResult.recovered).toBe(true);
    
    // Test auth error (shouldn't recover)
    const authResult = recoveryService.handleErrorWithRecovery(
      authError,
      'auth.login'
    );
    expect(authResult.recovered).toBe(false);
  });
  
  it('should handle errors during the recovery process itself', () => {
    // Mock backup availability
    vi.mocked(backupSystem.hasBackup).mockReturnValue(true);
    
    // Mock backup retrieval to fail
    vi.mocked(backupSystem.getDocumentBackup).mockImplementation(() => {
      throw new Error('Backup retrieval failed');
    });
    
    // Create a network error
    const networkError = new Error('Failed to fetch');
    
    // Simulate error handling with failed recovery
    const { recovered } = recoveryService.handleErrorWithRecovery(
      networkError,
      'document.save'
    );
    
    // Verify recovery was attempted but failed
    expect(recovered).toBe(false);
    expect(backupSystem.hasBackup).toHaveBeenCalledWith('test-doc-123');
    expect(backupSystem.getDocumentBackup).toHaveBeenCalledWith('test-doc-123');
  });
});
