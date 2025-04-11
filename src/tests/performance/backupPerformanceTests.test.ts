
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { backupDocument, getDocumentBackup } from '@/utils/backup/documentBackupSystem';
import { DocumentRecoveryService } from '@/services/DocumentRecoveryService';
import { generateDocumentChecksum } from '@/utils/backup/documentIntegrity';
import { UserRole } from '@/lib/types';
import { recoveryOperations } from '@/services/recovery/recovery/RecoveryOperations';
import { takeMemorySnapshot, compareSnapshots, formatBytes } from './backupMemoryUsageMonitor';

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
      backupDocument(content, `doc-${size}`, 'Test Document', 'writer' as UserRole, {}, true);
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
      await recoveryOperations.handleConcurrentRecovery(docId, 'writer' as UserRole);
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
        recoveryOperations.handleConcurrentRecovery(`concurrent-doc-${i}`, 'writer' as UserRole)
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

  it('should measure memory usage during backup operations', () => {
    // Create test document
    const content = generateDocumentContent(50000); // 50KB content
    
    // Memory snapshot before backup
    const beforeSnapshot = takeMemorySnapshot();
    
    // Perform backup
    backupDocument(content, 'memory-test-doc', 'Memory Test', 'writer' as UserRole, {}, true);
    
    // Memory snapshot after backup
    const afterSnapshot = takeMemorySnapshot();
    
    // Compare snapshots
    const memoryDiff = compareSnapshots(beforeSnapshot, afterSnapshot);
    
    // Log memory usage
    console.log(`Memory usage for backup: ${formatBytes(memoryDiff.heapDelta)}`);
    console.log(`Heap usage %: ${memoryDiff.heapUsagePercentageBefore.toFixed(2)}% → ${memoryDiff.heapUsagePercentageAfter.toFixed(2)}%`);
    
    // We don't make assertions about exact memory usage as it's environment dependent,
    // but we log it for analysis
  });

  it('should benchmark performance for different document sizes', () => {
    // Test with increasing sizes to identify potential performance cliffs
    const sizes = [1000, 5000, 10000, 50000, 100000, 250000];
    const results: {
      size: number;
      backupTime: number;
      checksumTime: number;
      totalTime: number;
    }[] = [];
    
    for (const size of sizes) {
      const content = generateDocumentContent(size);
      
      // Measure checksumming time
      startTime = performance.now();
      const checksum = generateDocumentChecksum(content);
      const checksumEndTime = performance.now();
      const checksumTime = checksumEndTime - startTime;
      
      // Measure backup time
      startTime = checksumEndTime;
      backupDocument(content, `benchmark-${size}`, `Benchmark ${size}`, 'writer' as UserRole, { checksum }, true);
      endTime = performance.now();
      const backupTime = endTime - startTime;
      
      // Total time
      const totalTime = checksumTime + backupTime;
      
      results.push({
        size,
        checksumTime,
        backupTime,
        totalTime
      });
      
      // Log individual result
      console.log(`Document size: ${size} chars - Checksum: ${checksumTime.toFixed(2)}ms, Backup: ${backupTime.toFixed(2)}ms, Total: ${totalTime.toFixed(2)}ms`);
    }
    
    // Check for any non-linear scaling issues
    // (We expect some increase with size, but it should remain roughly proportional)
    const smallSizeTime = results[0].totalTime / results[0].size;
    const largeSizeTime = results[results.length - 1].totalTime / results[results.length - 1].size;
    
    // The time per character for large documents should not be dramatically higher
    // than for small documents (allowing for some overhead)
    expect(largeSizeTime).toBeLessThan(smallSizeTime * 5);
  });
});
