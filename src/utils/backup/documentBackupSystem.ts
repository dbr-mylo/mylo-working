/**
 * Document backup system
 * 
 * This module provides utilities for creating, managing, and recovering
 * document backups to prevent data loss during errors or connectivity issues.
 */
import { UserRole, Document } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { generateDocumentChecksum, addChecksumToBackup } from './documentIntegrity';

// Constants for backup storage
const BACKUP_PREFIX = 'doc_backup_';
const BACKUP_INDEX = 'doc_backup_index';
const MAX_BACKUPS_PER_DOCUMENT = 3;
const MAX_BACKUPS_TOTAL = 20;
const BACKUP_RETENTION_DAYS = 7;

// Interface for document backup
export interface DocumentBackup {
  id: string;
  documentId: string | null;
  content: string;
  title: string;
  role: UserRole;
  timestamp: number;
  meta?: DocumentMeta;
  createdAt?: string;
  updatedAt?: string;
}

interface DocumentMeta {
  [key: string]: any;
  integrity?: {
    checksum?: string;
    algorithm?: string;
    timestamp?: string;
  };
}

interface BackupIndex {
  backups: {
    id: string;
    documentId: string | null;
    role: UserRole;
    timestamp: number;
  }[];
}

/**
 * Create a backup of the current document
 * 
 * @param content Document content
 * @param documentId Document ID (or null for new documents)
 * @param title Document title
 * @param role User role
 * @param meta Optional document metadata
 * @param withIntegrityCheck Add integrity check with checksum
 * @returns Boolean indicating if backup was created successfully
 */
export function backupDocument(
  content: string,
  documentId: string | null,
  title: string,
  role: UserRole,
  meta?: DocumentMeta,
  withIntegrityCheck: boolean = false
): boolean {
  try {
    if (!content || content.trim().length === 0) {
      return false;
    }
    
    // Create a new backup record
    const backupId = uuidv4();
    const timestamp = Date.now();
    const backup: DocumentBackup = {
      id: backupId,
      documentId,
      content,
      title: title || 'Untitled Document',
      role,
      timestamp,
      meta,
      createdAt: new Date(timestamp).toISOString(),
      updatedAt: new Date(timestamp).toISOString()
    };
    
    // Add integrity check if requested
    const finalBackup = withIntegrityCheck ? addChecksumToBackup(backup) : backup;
    
    // Store the backup
    localStorage.setItem(`${BACKUP_PREFIX}${backupId}`, JSON.stringify(finalBackup));
    
    // Update the backup index
    updateBackupIndex(backupId, documentId, role, backup.timestamp);
    
    // Clean up old backups to prevent storage overflow
    cleanupOldBackups();
    
    console.log(`Document backup created for ${documentId || 'new document'}${
      withIntegrityCheck ? ' with integrity check' : ''
    }`);
    return true;
  } catch (error) {
    console.error('Error creating document backup:', error);
    return false;
  }
}

/**
 * Check if a backup exists for a document
 * 
 * @param documentId Document ID (optional)
 * @param role User role (used for new documents)
 * @returns Boolean indicating if a backup exists
 */
export function hasBackup(documentId: string | null, role?: UserRole): boolean {
  try {
    const index = getBackupIndex();
    
    if (documentId) {
      // Check for backup by document ID
      return index.backups.some(b => b.documentId === documentId);
    } else if (role) {
      // Check for role-specific backups (useful for new documents)
      return index.backups.some(b => b.documentId === null && b.role === role);
    }
    
    return false;
  } catch (error) {
    console.error('Error checking for document backups:', error);
    return false;
  }
}

/**
 * Retrieve the most recent document backup
 * 
 * @param documentId Document ID (optional)
 * @param role User role (used for new documents)
 * @returns Document object or null if no backup exists
 */
export function getDocumentBackup(documentId: string | null, role?: UserRole): DocumentBackup | null {
  try {
    const index = getBackupIndex();
    let targetBackup;
    
    if (documentId) {
      // Find the most recent backup for this document ID
      targetBackup = [...index.backups]
        .filter(b => b.documentId === documentId)
        .sort((a, b) => b.timestamp - a.timestamp)[0];
    } else if (role) {
      // Find the most recent backup for this role (new documents)
      targetBackup = [...index.backups]
        .filter(b => b.documentId === null && b.role === role)
        .sort((a, b) => b.timestamp - a.timestamp)[0];
    }
    
    if (!targetBackup) {
      return null;
    }
    
    // Retrieve the full backup data
    const backupData = localStorage.getItem(`${BACKUP_PREFIX}${targetBackup.id}`);
    if (!backupData) return null;
    
    return JSON.parse(backupData) as DocumentBackup;
  } catch (error) {
    console.error('Error retrieving document backup:', error);
    return null;
  }
}

/**
 * Remove a backup after successful save
 * 
 * @param documentId Document ID
 * @returns Boolean indicating if the backup was removed
 */
export function removeBackup(documentId: string): boolean {
  try {
    const index = getBackupIndex();
    
    // Find backups for this document
    const documentBackups = index.backups.filter(b => b.documentId === documentId);
    
    if (documentBackups.length === 0) {
      return false;
    }
    
    // Remove backups from localStorage
    documentBackups.forEach(backup => {
      localStorage.removeItem(`${BACKUP_PREFIX}${backup.id}`);
    });
    
    // Update index
    index.backups = index.backups.filter(b => b.documentId !== documentId);
    localStorage.setItem(BACKUP_INDEX, JSON.stringify(index));
    
    console.log(`Removed ${documentBackups.length} backups for document ${documentId}`);
    return true;
  } catch (error) {
    console.error('Error removing document backup:', error);
    return false;
  }
}

/**
 * Get the backup index from localStorage
 */
function getBackupIndex(): BackupIndex {
  const indexData = localStorage.getItem(BACKUP_INDEX);
  if (!indexData) {
    return { backups: [] };
  }
  
  return JSON.parse(indexData);
}

/**
 * Update the backup index with a new backup entry
 */
function updateBackupIndex(
  backupId: string, 
  documentId: string | null,
  role: UserRole,
  timestamp: number
): void {
  const index = getBackupIndex();
  
  // Add new backup to index
  index.backups.push({
    id: backupId,
    documentId,
    role,
    timestamp
  });
  
  // Sort by timestamp (newest first)
  index.backups.sort((a, b) => b.timestamp - a.timestamp);
  
  localStorage.setItem(BACKUP_INDEX, JSON.stringify(index));
}

/**
 * Clean up old backups to prevent storage overflow
 */
function cleanupOldBackups(): void {
  const index = getBackupIndex();
  
  // Group backups by document ID
  const backupsByDocument: Record<string, typeof index.backups> = {};
  
  index.backups.forEach(backup => {
    const key = backup.documentId || 'null';
    if (!backupsByDocument[key]) {
      backupsByDocument[key] = [];
    }
    backupsByDocument[key].push(backup);
  });
  
  // Keep only MAX_BACKUPS_PER_DOCUMENT most recent backups for each document
  const updatedBackups: typeof index.backups = [];
  
  Object.values(backupsByDocument).forEach(documentBackups => {
    // Sort by timestamp (newest first)
    documentBackups.sort((a, b) => b.timestamp - a.timestamp);
    
    // Keep only the most recent backups
    const keepBackups = documentBackups.slice(0, MAX_BACKUPS_PER_DOCUMENT);
    updatedBackups.push(...keepBackups);
    
    // Remove excess backups from storage
    documentBackups.slice(MAX_BACKUPS_PER_DOCUMENT).forEach(backup => {
      localStorage.removeItem(`${BACKUP_PREFIX}${backup.id}`);
    });
  });
  
  // Ensure we don't exceed total backup limit
  if (updatedBackups.length > MAX_BACKUPS_TOTAL) {
    // Sort by timestamp (newest first)
    updatedBackups.sort((a, b) => b.timestamp - a.timestamp);
    
    // Remove oldest backups exceeding the limit
    updatedBackups
      .slice(MAX_BACKUPS_TOTAL)
      .forEach(backup => {
        localStorage.removeItem(`${BACKUP_PREFIX}${backup.id}`);
      });
    
    // Update the index to only include backups we're keeping
    index.backups = updatedBackups.slice(0, MAX_BACKUPS_TOTAL);
  } else {
    index.backups = updatedBackups;
  }
  
  // Remove backups older than retention period
  const retentionCutoff = Date.now() - (BACKUP_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  
  const expiredBackups = index.backups.filter(b => b.timestamp < retentionCutoff);
  expiredBackups.forEach(backup => {
    localStorage.removeItem(`${BACKUP_PREFIX}${backup.id}`);
  });
  
  index.backups = index.backups.filter(b => b.timestamp >= retentionCutoff);
  
  localStorage.setItem(BACKUP_INDEX, JSON.stringify(index));
}

/**
 * Verify all document backups and remove corrupted ones
 * @returns Object with verification stats
 */
export function verifyAndCleanBackups(): {
  total: number;
  valid: number;
  corrupted: number;
  noChecksum: number;
  removed: number;
} {
  try {
    const stats = {
      total: 0,
      valid: 0,
      corrupted: 0,
      noChecksum: 0,
      removed: 0
    };
    
    const index = getBackupIndex();
    stats.total = index.backups.length;
    
    // Check each backup
    for (const backupRef of [...index.backups]) {
      const backupKey = `${BACKUP_PREFIX}${backupRef.id}`;
      const backupData = localStorage.getItem(backupKey);
      
      if (!backupData) {
        // Backup reference exists but data is missing
        stats.corrupted++;
        stats.removed++;
        removeBackupFromIndex(backupRef.id, index);
        continue;
      }
      
      try {
        const backup = JSON.parse(backupData) as DocumentBackup;
        
        // Check if backup has integrity info
        if (backup.meta?.integrity?.checksum) {
          // Verify checksum
          const currentChecksum = generateDocumentChecksum(backup.content);
          if (currentChecksum === backup.meta.integrity.checksum) {
            stats.valid++;
          } else {
            stats.corrupted++;
            stats.removed++;
            localStorage.removeItem(backupKey);
            removeBackupFromIndex(backupRef.id, index);
          }
        } else {
          stats.noChecksum++;
        }
      } catch (parseError) {
        // Invalid JSON - corrupted backup
        stats.corrupted++;
        stats.removed++;
        localStorage.removeItem(backupKey);
        removeBackupFromIndex(backupRef.id, index);
      }
    }
    
    // Save updated index
    localStorage.setItem(BACKUP_INDEX, JSON.stringify(index));
    
    return stats;
  } catch (error) {
    console.error('Error verifying backups:', error);
    return { total: 0, valid: 0, corrupted: 0, noChecksum: 0, removed: 0 };
  }
}

/**
 * Remove a backup reference from the index
 */
function removeBackupFromIndex(backupId: string, index: BackupIndex): void {
  index.backups = index.backups.filter(b => b.id !== backupId);
}
