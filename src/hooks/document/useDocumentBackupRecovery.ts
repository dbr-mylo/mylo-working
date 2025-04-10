
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Document, UserRole } from "@/lib/types";
import { getDocumentBackup, hasBackup, removeBackup } from '@/utils/backup/documentBackupSystem';

interface UseDocumentBackupRecoveryProps {
  documentId: string | null;
  role: UserRole | null;
}

export function useDocumentBackupRecovery({
  documentId,
  role
}: UseDocumentBackupRecoveryProps) {
  const [hasAvailableBackup, setHasAvailableBackup] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Check for available backups
  const checkForBackups = useCallback(() => {
    const backupExists = documentId 
      ? hasBackup(documentId)
      : role 
        ? hasBackup(null, role)
        : false;
        
    setHasAvailableBackup(backupExists);
    return backupExists;
  }, [documentId, role]);
  
  // Recover from backup
  const recoverFromBackup = useCallback((): Document | null => {
    try {
      const backup = documentId 
        ? getDocumentBackup(documentId)
        : role
          ? getDocumentBackup(null, role)
          : null;
          
      if (backup) {
        toast({
          title: "Backup recovered",
          description: "Your unsaved work has been restored from a local backup.",
        });
        return backup;
      }
      
      return null;
    } catch (error) {
      console.error("Error recovering from backup:", error);
      toast({
        title: "Recovery failed",
        description: "Could not recover backup. Please try manual recovery.",
        variant: "destructive"
      });
      return null;
    }
  }, [documentId, role, toast]);
  
  // Clear backup after successful save
  const clearBackupAfterSave = useCallback(() => {
    if (documentId) {
      const removed = removeBackup(documentId);
      if (removed) {
        setHasAvailableBackup(false);
      }
    }
  }, [documentId]);
  
  return {
    hasAvailableBackup,
    checkForBackups,
    recoverFromBackup,
    clearBackupAfterSave
  };
}
