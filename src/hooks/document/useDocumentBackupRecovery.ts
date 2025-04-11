
import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Document, UserRole } from "@/lib/types";
import { documentRecoveryService } from '@/services/DocumentRecoveryService';

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
    // Initialize recovery service if needed
    if (documentId || role) {
      documentRecoveryService.initialize(
        documentId,
        'Document', // Use a default title until we know the actual one
        role
      );
    }
    
    const backupExists = documentRecoveryService.hasBackup();
    setHasAvailableBackup(backupExists);
    return backupExists;
  }, [documentId, role]);
  
  // Initial check when component mounts or deps change
  useEffect(() => {
    checkForBackups();
  }, [checkForBackups]);
  
  // Recover from backup
  const recoverFromBackup = useCallback((): Document | null => {
    try {
      const backup = documentRecoveryService.recoverFromBackup();
      
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
      const removed = documentRecoveryService.clearBackup();
      if (removed) {
        setHasAvailableBackup(false);
      }
      return removed;
    }
    return false;
  }, [documentId]);
  
  return {
    hasAvailableBackup,
    checkForBackups,
    recoverFromBackup,
    clearBackupAfterSave
  };
}
