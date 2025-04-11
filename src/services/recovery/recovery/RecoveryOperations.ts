
import { Document, UserRole } from '@/lib/types';
import { ErrorCategory, classifyError } from '@/utils/error/errorClassifier';
import { getDocumentBackup, removeBackup } from '@/utils/backup/documentBackupSystem';

/**
 * Handles recovery operations and error handling for document recovery
 */
export class RecoveryOperations {
  private recoveryAttempts: number = 0;
  private maxRecoveryAttempts: number = 3;
  
  /**
   * Reset recovery attempt counter
   */
  public resetRecoveryAttempts(): void {
    this.recoveryAttempts = 0;
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

      if (backup) {
        console.log(`Successfully recovered document from backup: "${backup.title}"`);
        // Adapt the retrieved backup to match the Document interface
        const recoveredDocument: Document = {
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
        return recoveredDocument;
      }

      return null;
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
