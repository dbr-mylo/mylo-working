
import { Document, UserRole } from '@/lib/types';
import { ErrorCategory, classifyError } from '@/utils/error/errorClassifier';
import { getDocumentBackup, removeBackup } from '@/utils/backup/documentBackupSystem';
import { verifyBackupIntegrity, attemptContentRecovery, verifyAndRepairBackup } from '@/utils/backup/documentIntegrity';

/**
 * Handles recovery operations and error handling for document recovery
 */
export class RecoveryOperations {
  private recoveryAttempts: number = 0;
  private maxRecoveryAttempts: number = 3;
  private concurrentRecoveries: number = 0;
  private maxConcurrentRecoveries: number = 2;
  private recoveryLock: boolean = false;
  private recoveryQueue: Array<() => Promise<void>> = [];
  private priorityDocuments: Set<string> = new Set();
  
  /**
   * Reset recovery attempt counter
   */
  public resetRecoveryAttempts(): void {
    this.recoveryAttempts = 0;
  }
  
  /**
   * Mark a document as high priority for recovery operations
   * (Used for currently active document)
   * @param documentId Document ID to prioritize
   */
  public setPriorityDocument(documentId: string): void {
    this.priorityDocuments.add(documentId);
  }
  
  /**
   * Clear priority status for a document
   * @param documentId Document ID
   */
  public clearPriorityDocument(documentId: string): void {
    this.priorityDocuments.delete(documentId);
  }
  
  /**
   * Check if document is currently marked as priority
   * @param documentId Document ID to check
   */
  private isPriorityDocument(documentId: string | null): boolean {
    return documentId !== null && this.priorityDocuments.has(documentId);
  }
  
  /**
   * Acquire lock for recovery operation
   * @returns Lock acquisition success
   */
  private acquireRecoveryLock(): boolean {
    if (this.recoveryLock || this.concurrentRecoveries >= this.maxConcurrentRecoveries) {
      return false;
    }
    
    this.recoveryLock = true;
    this.concurrentRecoveries++;
    return true;
  }
  
  /**
   * Release recovery lock
   */
  private releaseRecoveryLock(): void {
    this.recoveryLock = false;
    this.concurrentRecoveries = Math.max(0, this.concurrentRecoveries - 1);
    
    // Process next queued recovery if any
    this.processRecoveryQueue();
  }
  
  /**
   * Add recovery operation to queue
   */
  private addToRecoveryQueue(operation: () => Promise<void>, isPriority: boolean = false): void {
    if (isPriority) {
      // Add to front of queue for priority operations
      this.recoveryQueue.unshift(operation);
    } else {
      // Add to end of queue for normal operations
      this.recoveryQueue.push(operation);
    }
  }
  
  /**
   * Process next recovery in queue
   */
  private async processRecoveryQueue(): Promise<void> {
    if (this.recoveryQueue.length === 0 || this.recoveryLock) {
      return;
    }
    
    if (this.acquireRecoveryLock()) {
      const nextOperation = this.recoveryQueue.shift();
      if (nextOperation) {
        try {
          await nextOperation();
        } catch (error) {
          console.error('Error processing recovery queue operation:', error);
        } finally {
          this.releaseRecoveryLock();
        }
      } else {
        this.releaseRecoveryLock();
      }
    }
  }
  
  /**
   * Recover document from backup
   */
  public recoverFromBackup(documentId: string | null, userRole: UserRole | null): Document | null {
    try {
      this.recoveryAttempts++;
      const backup = documentId ?
        getDocumentBackup(documentId) :
        userRole ? getDocumentBackup(null, userRole) : null;

      if (!backup) {
        return null;
      }
      
      // Verify backup integrity
      const integrityCheck = verifyBackupIntegrity(backup);
      
      if (integrityCheck.valid) {
        console.log(`Successfully recovered document from verified backup: "${backup.title}"`);
      } else if (integrityCheck.status === 'corrupted') {
        console.warn(`Backup for "${backup.title}" failed integrity check: ${integrityCheck.details}`);
        
        // Attempt to repair corrupted backup
        const repairResult = verifyAndRepairBackup(backup);
        
        if (repairResult.status === 'repaired' && repairResult.repairedBackup) {
          console.log(`Repaired corrupted backup for "${backup.title}" using ${repairResult.repairedBackup.meta?.recovery?.method} method`);
          
          // Use the repaired backup
          const repairedDoc = this.convertBackupToDocument(repairResult.repairedBackup);
          return repairedDoc;
        }
        
        // If repair failed and we haven't exceeded attempts, try alternative recovery
        if (this.recoveryAttempts < this.maxRecoveryAttempts) {
          console.log(`Integrity verification failed, attempt ${this.recoveryAttempts}. Trying alternative recovery...`);
          return this.attemptAlternativeRecovery();
        }
        return null;
      }

      // Convert backup to Document format
      return this.convertBackupToDocument(backup);
    } catch (error) {
      console.error("Error recovering document from backup:", error);
      // If we haven't exceeded max attempts, we could try a different recovery strategy
      if (this.recoveryAttempts < this.maxRecoveryAttempts) {
        console.log(`Recovery attempt ${this.recoveryAttempts} failed, trying different strategy...`);
        return this.attemptAlternativeRecovery();
      }
      return null;
    }
  }

  /**
   * Convert a DocumentBackup to the Document format
   */
  private convertBackupToDocument(backup: DocumentBackup): Document {
    return {
      id: backup.documentId || backup.id,
      title: backup.title,
      content: backup.content,
      updated_at: backup.updatedAt || new Date().toISOString(),
      created_at: backup.createdAt || backup.updatedAt || new Date().toISOString(),
      owner_id: backup.meta?.owner_id,
      status: backup.meta?.status,
      meta: backup.meta || {},
      version: backup.meta?.version || 1
    };
  }

  /**
   * Try alternative recovery methods if primary fails
   */
  private attemptAlternativeRecovery(): Document | null {
    // This could implement fallback strategies like:
    // 1. Looking in different storage locations
    // 2. Trying to parse partially corrupted backups
    // 3. Recovering from session storage instead of local storage
    console.log("Attempting alternative recovery methods...");
    return null;
  }

  /**
   * Clear backup after successful save
   */
  public clearBackup(documentId: string | null): boolean {
    if (documentId) {
      return removeBackup(documentId);
    }
    return false;
  }
  
  /**
   * Handle concurrent recovery requests
   */
  public async handleConcurrentRecovery(
    documentId: string | null,
    userRole: UserRole | null
  ): Promise<Document | null> {
    // Check if this is a priority document
    const isPriority = documentId !== null && this.isPriorityDocument(documentId);
    
    // If we can acquire the lock, process immediately
    if (this.acquireRecoveryLock()) {
      try {
        return this.recoverFromBackup(documentId, userRole);
      } finally {
        this.releaseRecoveryLock();
      }
    } else {
      // Otherwise queue the recovery
      return new Promise((resolve) => {
        this.addToRecoveryQueue(async () => {
          const result = this.recoverFromBackup(documentId, userRole);
          resolve(result);
        }, isPriority);
        
        // Attempt to process the queue
        this.processRecoveryQueue();
      });
    }
  }
  
  /**
   * Handle recovery for specific error types
   */
  public handleErrorWithRecovery(
    error: unknown, 
    context: string,
    documentId: string | null,
    userRole: UserRole | null,
    hasBackup: () => boolean,
    recoverFromBackup: () => Document | null
  ): {
    recovered: boolean;
    recoveryDocument?: Document | null;
  } {
    const classifiedError = classifyError(error, context);
    
    // Determine if this is an error where document recovery makes sense
    if (
      classifiedError.category === ErrorCategory.NETWORK ||
      classifiedError.category === ErrorCategory.STORAGE ||
      classifiedError.category === ErrorCategory.SERVER ||
      classifiedError.category === ErrorCategory.TIMEOUT
    ) {
      if (hasBackup()) {
        const recoveredDocument = recoverFromBackup();
        if (recoveredDocument) {
          return { recovered: true, recoveryDocument: recoveredDocument };
        }
      }
    }
    
    return { recovered: false };
  }
}

export const recoveryOperations = new RecoveryOperations();
