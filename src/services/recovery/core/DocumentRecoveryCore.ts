
import { Document, UserRole } from '@/lib/types';
import { backupDocument, hasBackup, getDocumentBackup, removeBackup } from '@/utils/backup/documentBackupSystem';
import { ErrorCategory, classifyError } from '@/utils/error/errorClassifier';

export interface DocumentBackupOptions {
  autoBackupInterval?: number; // in milliseconds
  maxDocumentRevisions?: number;
}

export const DEFAULT_BACKUP_OPTIONS: DocumentBackupOptions = {
  autoBackupInterval: 60000, // 1 minute
  maxDocumentRevisions: 5,
};

/**
 * Core document recovery service for creating and managing document backups
 */
export class DocumentRecoveryCore {
  private autoBackupIntervalId: number | null = null;
  protected lastBackupContent: string = '';
  private backupOptions: DocumentBackupOptions;
  protected documentId: string | null = null;
  protected documentTitle: string = '';
  protected userRole: UserRole | null = null;
  private onBackupCreated?: (timestamp: Date) => void;
  
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
   * Check if a backup exists for the current document
   */
  public hasBackup(): boolean {
    return this.documentId ? 
      hasBackup(this.documentId) : 
      this.userRole ? hasBackup(null, this.userRole) : false;
  }

  /**
   * Cleanup and dispose of the service
   */
  public dispose(): void {
    this.stopAutoBackup();
    console.log(`Document recovery service disposed for "${this.documentTitle}"`);
  }
}
