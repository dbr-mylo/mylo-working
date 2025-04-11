
import { UserRole } from '@/lib/types';
import { backupDocument } from '@/utils/backup/documentBackupSystem';
import { addChecksumToBackup } from '@/utils/backup/documentIntegrity';

/**
 * Manages document backup creation and operations
 */
export class BackupManager {
  /**
   * Create a backup of document content
   * 
   * @param content Document content to back up
   * @param documentId Optional document ID
   * @param documentTitle Document title
   * @param userRole User role
   * @param lastBackupContent Previous backup content to check against
   * @param meta Additional metadata
   * @returns True if backup was created, false otherwise
   */
  public createBackup(
    content: string,
    documentId: string | null,
    documentTitle: string,
    userRole: UserRole | null,
    lastBackupContent: string,
    meta?: any
  ): boolean {
    // Don't backup if content is the same as last backup
    if (content === lastBackupContent) {
      return false;
    }

    // Create the backup
    if (documentId || userRole) {
      // Add checksum to metadata for integrity verification
      const enhancedMeta = {
        ...meta,
        backupTime: new Date().toISOString()
      };
      
      const result = backupDocument(
        content,
        documentId,
        documentTitle,
        userRole as UserRole,
        enhancedMeta,
        true // Enable integrity check
      );

      if (result) {
        console.log(`Created backup with integrity check for document "${documentTitle}"`);
      }

      return result;
    }

    return false;
  }
}

export const backupManager = new BackupManager();
