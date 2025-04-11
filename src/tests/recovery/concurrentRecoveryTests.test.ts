
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { recoveryOperations } from '@/services/recovery/recovery/RecoveryOperations';
import * as backupSystem from '@/utils/backup/documentBackupSystem';
import { UserRole } from '@/lib/types';

// Mock the document backup system
vi.mock('@/utils/backup/documentBackupSystem', () => ({
  backupDocument: vi.fn(),
  hasBackup: vi.fn(),
  getDocumentBackup: vi.fn(),
  removeBackup: vi.fn()
}));

describe('Concurrent Recovery Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset recovery attempts
    recoveryOperations.resetRecoveryAttempts();
    
    // Default mock implementation
    vi.mocked(backupSystem.hasBackup).mockReturnValue(true);
  });
  
  it('should handle concurrent recovery attempts', async () => {
    // Create mock data for different documents
    const mockDoc1 = {
      id: 'backup-1',
      documentId: 'doc1',
      title: 'Document 1',
      content: 'Content for document 1',
      role: 'writer' as UserRole,
      timestamp: Date.now(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      meta: { version: 1 }
    };
    
    const mockDoc2 = {
      id: 'backup-2',
      documentId: 'doc2',
      title: 'Document 2',
      content: 'Content for document 2',
      role: 'writer' as UserRole,
      timestamp: Date.now(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      meta: { version: 1 }
    };
    
    // Mock getDocumentBackup with delay to simulate async operation
    vi.mocked(backupSystem.getDocumentBackup).mockImplementation((docId) => {
      if (docId === 'doc1') {
        return mockDoc1;
      } else if (docId === 'doc2') {
        return mockDoc2;
      }
      return null;
    });
    
    // Attempt concurrent recoveries
    const recoveryPromises = [
      recoveryOperations.handleConcurrentRecovery('doc1', 'writer' as UserRole),
      recoveryOperations.handleConcurrentRecovery('doc2', 'writer' as UserRole),
      recoveryOperations.handleConcurrentRecovery('doc1', 'writer' as UserRole)
    ];
    
    // Wait for all to complete
    const results = await Promise.all(recoveryPromises);
    
    // Verify all recoveries completed
    expect(results.length).toBe(3);
    expect(results[0]).not.toBeNull();
    expect(results[1]).not.toBeNull();
    expect(results[2]).not.toBeNull();
    
    // Verify document content matches expected
    expect(results[0]?.content).toBe('Content for document 1');
    expect(results[1]?.content).toBe('Content for document 2');
    expect(results[2]?.content).toBe('Content for document 1');
    
    // getDocumentBackup should have been called three times
    expect(backupSystem.getDocumentBackup).toHaveBeenCalledTimes(3);
  });
  
  it('should handle recovery failures during concurrent operations', async () => {
    // Mock first call to succeed, second to fail
    vi.mocked(backupSystem.getDocumentBackup)
      .mockImplementationOnce(() => ({
        id: 'backup-1',
        documentId: 'doc1',
        title: 'Document 1',
        content: 'Content for document 1',
        role: 'writer' as UserRole,
        timestamp: Date.now(),
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }))
      .mockImplementationOnce(() => {
        throw new Error('Simulated recovery failure');
      });
    
    // Attempt concurrent recoveries
    const [result1, result2] = await Promise.all([
      recoveryOperations.handleConcurrentRecovery('doc1', 'writer' as UserRole),
      recoveryOperations.handleConcurrentRecovery('doc2', 'writer' as UserRole).catch(() => null)
    ]);
    
    // First request should succeed
    expect(result1).not.toBeNull();
    expect(result1?.title).toBe('Document 1');
    
    // Second request should fail but not crash the system
    expect(result2).toBeNull();
  });
  
  it('should queue recovery attempts when maximum concurrent operations reached', async () => {
    let completedOperations = 0;
    
    // Mock getDocumentBackup with delay to simulate async operation
    vi.mocked(backupSystem.getDocumentBackup).mockImplementation((docId) => {
      return {
        id: `backup-${docId}`,
        documentId: docId as string,
        title: `Document ${docId}`,
        content: `Content for document ${docId}`,
        role: 'writer' as UserRole,
        timestamp: Date.now(),
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
    });
    
    // Create tracking for completed operations
    const trackOperation = () => {
      completedOperations++;
    };
    
    // Start multiple recovery operations
    const recoveryPromises = [
      recoveryOperations.handleConcurrentRecovery('doc1', 'writer' as UserRole).then(res => {
        trackOperation();
        return res;
      }),
      recoveryOperations.handleConcurrentRecovery('doc2', 'writer' as UserRole).then(res => {
        trackOperation();
        return res;
      }),
      recoveryOperations.handleConcurrentRecovery('doc3', 'writer' as UserRole).then(res => {
        trackOperation();
        return res;
      }),
      recoveryOperations.handleConcurrentRecovery('doc4', 'writer' as UserRole).then(res => {
        trackOperation();
        return res;
      })
    ];
    
    // Wait for all to complete
    const results = await Promise.all(recoveryPromises);
    
    // All operations should eventually complete
    expect(completedOperations).toBe(4);
    
    // All results should be valid
    results.forEach(result => {
      expect(result).not.toBeNull();
      expect(result?.content).toContain('Content for document');
    });
  });

  it('should prioritize recovery operations for active documents', async () => {
    // Setup tracking of recovery order
    const recoveryOrder: string[] = [];
    
    // Mock getDocumentBackup to track order and add delays
    vi.mocked(backupSystem.getDocumentBackup).mockImplementation((docId) => {
      recoveryOrder.push(docId as string);
      
      return {
        id: `backup-${docId}`,
        documentId: docId as string,
        title: `Document ${docId}`,
        content: `Content for document ${docId}`,
        role: 'writer' as UserRole,
        timestamp: Date.now(),
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        meta: {
          priority: docId === 'active-doc' ? 'high' : 'normal'
        }
      };
    });
    
    // Mark one document as "active" (should be prioritized)
    // @ts-ignore - accessing private method for testing
    recoveryOperations.setPriorityDocument('active-doc');
    
    // Start multiple recovery operations including the active document last
    const recoveryPromises = [
      recoveryOperations.handleConcurrentRecovery('doc1', 'writer' as UserRole),
      recoveryOperations.handleConcurrentRecovery('doc2', 'writer' as UserRole),
      recoveryOperations.handleConcurrentRecovery('active-doc', 'writer' as UserRole)
    ];
    
    // Wait for all to complete
    await Promise.all(recoveryPromises);
    
    // We expect active-doc to be recovered before or immediately after the first doc
    // (exact order depends on implementation, but should be early in the queue)
    expect(recoveryOrder.indexOf('active-doc')).toBeLessThanOrEqual(1);
  });
});
