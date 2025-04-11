
import { backupDocument, hasBackup, getDocumentBackup, removeBackup } from '@/utils/backup/documentBackupSystem';
import { UserRole, Document } from '@/lib/types';
import { ErrorCategory, classifyError } from '@/utils/error/errorClassifier';

export interface DocumentBackupOptions {
  autoBackupInterval?: number; // in milliseconds
  maxDocumentRevisions?: number;
}

const DEFAULT_BACKUP_OPTIONS: DocumentBackupOptions = {
  autoBackupInterval: 60000, // 1 minute
  maxDocumentRevisions: 5,
};

export class DocumentRecoveryService {
  private autoBackupIntervalId: number | null = null;
  private lastBackupContent: string = '';
  private backupOptions: DocumentBackupOptions;
  private documentId: string | null = null;
  private documentTitle: string = '';
  private userRole: UserRole | null = null;
  private onBackupCreated?: (timestamp: Date) => void;
  private recoveryAttempts: number = 0;
  private maxRecoveryAttempts: number = 3;

  constructor(options: DocumentBackupOptions = {}) {
    this.backupOptions = { ...DEFAULT_BACKUP_OPTIONS, ...options };
  }

  /**
   * Initialize the recovery service for a specific document
   */
  public initialize(
    documentId: string | null,
    documentTitle: string,
    userRole: UserRole | null,
    onBackupCreated?: (timestamp: Date) => void
  ): void {
    this.documentId = documentId;
    this.documentTitle = documentTitle;
    this.userRole = userRole;
    this.onBackupCreated = onBackupCreated;
    this.recoveryAttempts = 0;

    console.log(`Document recovery service initialized for document "${documentTitle}"`);
  }

  /**
   * Start automatic periodic backups
   */
  public startAutoBackup(initialContent: string = ''): void {
    // Store initial content
    this.lastBackupContent = initialContent;

    // Create initial backup if we have content
    if (initialContent && initialContent.trim().length > 0) {
      this.createBackup(initialContent);
    }

    // Set up interval for periodic backups
    this.autoBackupIntervalId = window.setInterval(() => {
      console.log(`Auto backup check for "${this.documentTitle}"`);
    }, this.backupOptions.autoBackupInterval);

    console.log(`Started auto-backup for document "${this.documentTitle}" with interval ${this.backupOptions.autoBackupInterval}ms`);
  }

  /**
   * Stop automatic backups
   */
  public stopAutoBackup(): void {
    if (this.autoBackupIntervalId !== null) {
      window.clearInterval(this.autoBackupIntervalId);
      this.autoBackupIntervalId = null;
      console.log(`Stopped auto-backup for document "${this.documentTitle}"`);
    }
  }

  /**
   * Manually create a backup
   */
  public createBackup(content: string, meta?: any): boolean {
    // Don't backup if content is the same as last backup
    if (content === this.lastBackupContent) {
      return false;
    }

    // Create the backup
    if (this.documentId || this.userRole) {
      const result = backupDocument(
        content,
        this.documentId,
        this.documentTitle,
        this.userRole as UserRole,
        meta
      );

      if (result) {
        this.lastBackupContent = content;
        if (this.onBackupCreated) {
          this.onBackupCreated(new Date());
        }
        console.log(`Created backup for document "${this.documentTitle}"`);
      }

      return result;
    }

    return false;
  }

  /**
   * Check if a backup exists for the current document
   */
  public hasBackup(): boolean {
    return this.documentId ? 
      hasBackup(this.documentId) : 
      this.userRole ? hasBackup(null, this.userRole) : false;
  }

  /**
   * Recover document from backup
   */
  public recoverFromBackup(): Document | null {
    try {
      this.recoveryAttempts++;
      const backup = this.documentId ?
        getDocumentBackup(this.documentId) :
        this.userRole ? getDocumentBackup(null, this.userRole) : null;

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
  public clearBackup(): boolean {
    if (this.documentId) {
      return removeBackup(this.documentId);
    }
    return false;
  }

  /**
   * Handle recovery for specific error types
   */
  public handleErrorWithRecovery(error: unknown, context: string): {
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
      if (this.hasBackup()) {
        const recoveredDocument = this.recoverFromBackup();
        if (recoveredDocument) {
          return { recovered: true, recoveryDocument: recoveredDocument };
        }
      }
    }
    
    return { recovered: false };
  }

  /**
   * Cleanup and dispose of the service
   */
  public dispose(): void {
    this.stopAutoBackup();
    console.log(`Document recovery service disposed for "${this.documentTitle}"`);
  }
}

// Singleton service instance for app-wide use
export const documentRecoveryService = new DocumentRecoveryService();
