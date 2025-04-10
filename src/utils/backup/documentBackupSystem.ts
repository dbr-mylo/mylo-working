
import { Document, DocumentMeta } from "@/lib/types";

interface BackupDocument {
  id: string | null;
  content: string;
  title: string;
  role: string;
  timestamp: string;
  meta?: DocumentMeta;
}

const BACKUP_KEY = 'mylo-document-backups';
const MAX_BACKUPS = 10;

/**
 * Creates a backup of the current document in local storage
 */
export function backupDocument(
  content: string, 
  documentId: string | null, 
  documentTitle: string,
  role: string,
  meta?: DocumentMeta
): boolean {
  try {
    if (!content || content.trim() === '') {
      return false;
    }
    
    // Get existing backups
    const existingBackupsStr = localStorage.getItem(BACKUP_KEY);
    const backups: BackupDocument[] = existingBackupsStr 
      ? JSON.parse(existingBackupsStr) 
      : [];
      
    // Create new backup
    const newBackup: BackupDocument = {
      id: documentId,
      content,
      title: documentTitle || 'Untitled Document',
      role,
      timestamp: new Date().toISOString(),
      meta
    };
    
    // Check if we already have a backup for this document
    const documentIndex = backups.findIndex(backup => 
      backup.id === documentId || 
      (backup.title === documentTitle && backup.role === role)
    );
    
    // Update existing backup or add new one
    if (documentIndex !== -1) {
      backups[documentIndex] = newBackup;
    } else {
      // Add new backup and limit the total number
      backups.push(newBackup);
      if (backups.length > MAX_BACKUPS) {
        backups.shift(); // Remove oldest backup
      }
    }
    
    // Save back to localStorage
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backups));
    
    return true;
  } catch (error) {
    console.error('Error creating document backup:', error);
    return false;
  }
}

/**
 * Check if backups exist for a document
 */
export function hasBackup(documentId?: string | null, role?: string | null): boolean {
  try {
    const existingBackupsStr = localStorage.getItem(BACKUP_KEY);
    if (!existingBackupsStr) return false;
    
    const backups: BackupDocument[] = JSON.parse(existingBackupsStr);
    
    if (documentId) {
      return backups.some(backup => backup.id === documentId);
    } else if (role) {
      return backups.some(backup => backup.role === role);
    }
    
    return backups.length > 0;
  } catch (error) {
    console.error('Error checking document backups:', error);
    return false;
  }
}

/**
 * Retrieve document backup by document ID or role
 */
export function getDocumentBackup(
  documentId?: string | null, 
  role?: string | null
): Document | null {
  try {
    const existingBackupsStr = localStorage.getItem(BACKUP_KEY);
    if (!existingBackupsStr) return null;
    
    const backups: BackupDocument[] = JSON.parse(existingBackupsStr);
    
    // Find specific backup
    let backup: BackupDocument | undefined;
    
    if (documentId) {
      backup = backups.find(b => b.id === documentId);
    } else if (role) {
      // Get the most recent backup for this role
      backup = [...backups]
        .filter(b => b.role === role)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    }
    
    if (!backup) return null;
    
    // Convert to Document format
    const document: Document = {
      id: backup.id || crypto.randomUUID(),
      title: backup.title,
      content: backup.content,
      updated_at: backup.timestamp
    };
    
    // Add meta if available
    if (backup.meta) {
      document.meta = backup.meta;
    }
    
    return document;
  } catch (error) {
    console.error('Error retrieving document backup:', error);
    return null;
  }
}

/**
 * Removes a backup from storage
 */
export function removeBackup(documentId: string | null): boolean {
  try {
    if (!documentId) return false;
    
    const existingBackupsStr = localStorage.getItem(BACKUP_KEY);
    if (!existingBackupsStr) return false;
    
    const backups: BackupDocument[] = JSON.parse(existingBackupsStr);
    const filteredBackups = backups.filter(backup => backup.id !== documentId);
    
    if (filteredBackups.length === backups.length) {
      return false; // Nothing was removed
    }
    
    localStorage.setItem(BACKUP_KEY, JSON.stringify(filteredBackups));
    return true;
  } catch (error) {
    console.error('Error removing document backup:', error);
    return false;
  }
}
