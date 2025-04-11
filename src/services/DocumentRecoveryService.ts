
import { Document, UserRole } from '@/lib/types';
import { ErrorCategory } from '@/utils/error/errorClassifier';
import { DocumentRecoveryCore, DocumentBackupOptions, DEFAULT_BACKUP_OPTIONS } from './recovery/core/DocumentRecoveryCore';
import { backupManager } from './recovery/backup/BackupManager';
import { recoveryOperations } from './recovery/recovery/RecoveryOperations';

/**
 * Main document recovery service that handles backup creation and restoration
 */
export class DocumentRecoveryService extends DocumentRecoveryCore {
  constructor(options: DocumentBackupOptions = {}) {
    super(options);
  }
  
  /**
   * Initialize the recovery service 
   */
  public initialize(
    documentId: string | null,
    documentTitle: string,
    userRole: UserRole | null,
    onBackupCreated?: (timestamp: Date) => void
  ): void {
    recoveryOperations.resetRecoveryAttempts();
    super.initialize(documentId, documentTitle, userRole, onBackupCreated);
  }
  
  /**
   * Manually create a backup
   */
  public createBackup(content: string, meta?: any): boolean {
    // Pass to the backup manager
    const result = backupManager.createBackup(
      content,
      this.documentId,
      this.documentTitle,
      this.userRole,
      this.lastBackupContent,
      meta
    );
    
    if (result) {
      this.lastBackupContent = content;
      if (this.onBackupCreated) {
        this.onBackupCreated(new Date());
      }
    }
    
    return result;
  }

  /**
   * Internal backup implementation, overrides the base class method
   */
  protected createBackupInternal(content: string, meta?: any): boolean {
    return this.createBackup(content, meta);
  }
  
  /**
   * Recover document from backup
   */
  public recoverFromBackup(): Document | null {
    return recoveryOperations.recoverFromBackup(this.documentId, this.userRole);
  }
  
  /**
   * Clear backup after successful save
   */
  public clearBackup(): boolean {
    return recoveryOperations.clearBackup(this.documentId);
  }
  
  /**
   * Handle recovery for specific error types
   */
  public handleErrorWithRecovery(error: unknown, context: string): {
    recovered: boolean;
    recoveryDocument?: Document | null;
  } {
    return recoveryOperations.handleErrorWithRecovery(
      error, 
      context, 
      this.documentId, 
      this.userRole,
      () => this.hasBackup(),
      () => this.recoverFromBackup()
    );
  }
}

// Singleton service instance for app-wide use
export const documentRecoveryService = new DocumentRecoveryService();
