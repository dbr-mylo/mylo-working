
import { useState, useEffect, useCallback, useRef } from 'react';
import { UserRole } from '@/lib/types';
import { documentRecoveryService } from '@/services/DocumentRecoveryService';

export interface UseAutomaticBackupOptions {
  documentId: string | null;
  documentTitle: string;
  content: string;
  initialContent: string;
  userRole: UserRole | null;
  enabled?: boolean;
  backupInterval?: number;
  backupOnIdle?: boolean;
  idleTime?: number; // ms before user is considered idle
  backupThreshold?: number; // min length difference to trigger backup
}

export interface UseAutomaticBackupResult {
  lastBackupTime: Date | null;
  isBackupEnabled: boolean;
  setBackupEnabled: (enabled: boolean) => void;
  manualBackup: () => boolean;
  hasBackup: boolean;
}

/**
 * Hook for automatic document content backups
 */
export function useAutomaticBackup({
  documentId,
  documentTitle,
  content,
  initialContent,
  userRole,
  enabled = true,
  backupInterval = 60000, // 1 minute default
  backupOnIdle = true,
  idleTime = 30000, // 30 seconds default
  backupThreshold = 10 // minimum character difference to backup
}: UseAutomaticBackupOptions): UseAutomaticBackupResult {
  const [lastBackupTime, setLastBackupTime] = useState<Date | null>(null);
  const [isBackupEnabled, setBackupEnabled] = useState<boolean>(enabled);
  const [hasBackup, setHasBackup] = useState<boolean>(false);
  
  const lastContentRef = useRef<string>(initialContent);
  const idleTimerRef = useRef<number | null>(null);
  
  // Initialize the recovery service
  useEffect(() => {
    if (documentId || userRole) {
      documentRecoveryService.initialize(
        documentId,
        documentTitle,
        userRole,
        (timestamp) => setLastBackupTime(timestamp)
      );
      
      // Check if we have an existing backup
      const backupExists = documentRecoveryService.hasBackup();
      setHasBackup(backupExists);
      
      if (isBackupEnabled) {
        documentRecoveryService.startAutoBackup(initialContent);
      }
      
      return () => {
        documentRecoveryService.dispose();
        if (idleTimerRef.current) {
          window.clearTimeout(idleTimerRef.current);
        }
      };
    }
  }, [documentId, documentTitle, userRole, initialContent, isBackupEnabled]);

  // Handle content changes for backups
  useEffect(() => {
    if (!isBackupEnabled || !content) return;

    // Only backup if there's a significant change
    const contentDiff = Math.abs(content.length - lastContentRef.current.length);
    if (contentDiff >= backupThreshold) {
      console.log(`Content changed significantly (${contentDiff} chars), creating backup...`);
      const success = documentRecoveryService.createBackup(content);
      if (success) {
        lastContentRef.current = content;
        setHasBackup(true);
      }
    }
  }, [content, isBackupEnabled, backupThreshold]);
  
  // Set up idle detection for backups
  useEffect(() => {
    if (!isBackupEnabled || !backupOnIdle) return;
    
    const resetIdleTimer = () => {
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      
      idleTimerRef.current = window.setTimeout(() => {
        // User is idle, create a backup if content has changed
        if (content !== lastContentRef.current) {
          console.log('User idle, creating backup...');
          const success = documentRecoveryService.createBackup(content);
          if (success) {
            lastContentRef.current = content;
            setHasBackup(true);
          }
        }
      }, idleTime);
    };
    
    // Set up event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetIdleTimer, { passive: true });
    });
    
    // Initial timer
    resetIdleTimer();
    
    // Cleanup
    return () => {
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [content, isBackupEnabled, backupOnIdle, idleTime]);
  
  // Manual backup function
  const manualBackup = useCallback(() => {
    const success = documentRecoveryService.createBackup(content);
    if (success) {
      lastContentRef.current = content;
      setHasBackup(true);
    }
    return success;
  }, [content]);

  return {
    lastBackupTime,
    isBackupEnabled,
    setBackupEnabled,
    manualBackup,
    hasBackup
  };
}
