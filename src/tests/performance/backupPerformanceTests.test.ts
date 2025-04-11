
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { backupDocument, getDocumentBackup } from '@/utils/backup/documentBackupSystem';
import { DocumentRecoveryService } from '@/services/DocumentRecoveryService';
import { generateDocumentChecksum } from '@/utils/backup/documentIntegrity';
import { UserRole } from '@/lib/types';

describe('Document Backup Performance', () => {
  let startTime: number;
  let endTime: number;
  
  // Create realistic document content
  const generateDocumentContent = (size: number): string => {
    const paragraph = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ';
    let content = '';
    
    while (content.length < size) {
      content += paragraph;
    }
    
    return content.substring(0, size);
  };
  
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
      })
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
    
    // Reset timing
    startTime = 0;
    endTime = 0;
    
    // Clear mocks
    vi.clearAllMocks();
  });
  
  it('should perform backup operations within acceptable time', () => {
    // Create test documents of increasing size
    const sizes = [1000, 10000, 50000]; // characters
    const results: Record<number, number> = {};
    
    for (const size of sizes) {
      const content = generateDocumentContent(size);
      
      // Measure backup time
      startTime = performance.now();
      backupDocument(`doc-${size}`, 'Test Document', 'writer' as UserRole, content, {}, true);
      endTime = performance.now();
      
      const duration = endTime - startTime;
      results[size] = duration;
      
      // Basic performance assertion - backup should be reasonably fast
      expect(duration).toBeLessThan(500); // 500ms is a reasonable upper limit for a backup operation
    }
    
    // Log results for analysis
    console.log('Backup performance results:', results);
  });
  
  it('should perform checksum generation within acceptable time', () => {
    // Create test documents of increasing size
    const sizes = [1000, 10000, 50000, 100000]; // characters
    const results: Record<number, number> = {};
    
    for (const size of sizes) {
      const content = generateDocumentContent(size);
      
      // Measure checksum generation time
      startTime = performance.now();
      generateDocumentChecksum(content);
      endTime = performance.now();
      
      const duration = endTime - startTime;
      results[size] = duration;
      
      // Checksum generation should be fast enough for interactive use
      expect(duration).toBeLessThan(200); // 200ms is the threshold for perceived instant response
    }
    
    // Log results for analysis
    console.log('Checksum generation performance results:', results);
  });
  
  it('should perform recovery operations within acceptable time', async () => {
    // Initialize recovery service
    const recoveryService = new DocumentRecoveryService();
    recoveryService.initialize('perf-test', 'Performance Test Document', 'writer' as UserRole);
    
    // Create backups of increasing size
    const sizes = [1000, 10000, 50000]; // characters
    const results: Record<number, number> = {};
    
    for (const size of sizes) {
      const content = generateDocumentContent(size);
      const docId = `doc-${size}`;
      
      // Create backup
      backupDocument(content, docId, 'Test Document', 'writer' as UserRole, {}, true);
      
      // Measure recovery time
      startTime = performance.now();
      await recoveryOperations.handleConcurrentRecovery(docId, 'writer');
      endTime = performance.now();
      
      const duration = endTime - startTime;
      results[size] = duration;
      
      // Recovery should be reasonably fast for user experience
      expect(duration).toBeLessThan(1000); // 1 second is a reasonable upper limit for recovery
    }
    
    // Log results for analysis
    console.log('Recovery performance results:', results);
  });
  
  it('should handle multiple concurrent operations efficiently', async () => {
    // Create multiple documents
    const documentCount = 5;
    const documentSize = 10000; // characters
    
    // Create backups
    for (let i = 0; i < documentCount; i++) {
      const content = generateDocumentContent(documentSize);
      const docId = `concurrent-doc-${i}`;
      backupDocument(content, docId, `Test Document ${i}`, 'writer' as UserRole, {}, true);
    }
    
    // Perform concurrent operations
    startTime = performance.now();
    
    await Promise.all(
      Array.from({ length: documentCount }).map((_, i) => 
        recoveryOperations.handleConcurrentRecovery(`concurrent-doc-${i}`, 'writer')
      )
    );
    
    endTime = performance.now();
    
    const totalDuration = endTime - startTime;
    const averageDuration = totalDuration / documentCount;
    
    // Log results
    console.log(`Concurrent recovery performance: ${totalDuration}ms total, ${averageDuration}ms average`);
    
    // Concurrent operations should be efficient
    expect(averageDuration).toBeLessThan(500); // Average per document should be under 500ms
    
    // Total time should be significantly less than sequential execution would take
    // (i.e., we're getting some parallelization benefit)
    expect(totalDuration).toBeLessThan(documentCount * 500 * 0.7); // At least 30% better than sequential
  });
});
