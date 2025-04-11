
import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Document, UserRole } from "@/lib/types";
import { enhancedDocumentRecoveryService } from '@/services/EnhancedDocumentRecoveryService';
import { toast } from "sonner";
import { CheckCircle, AlertCircle, History } from "lucide-react";
import { useOnlineStatus } from '../useOnlineStatus';

interface UseEnhancedDocumentRecoveryProps {
  documentId: string | null;
  role: UserRole | null;
  content?: string;
}

interface RecoveryStats {
  backupsCreated: number;
  recoveryAttempts: number;
  successfulRecoveries: number;
}

export function useEnhancedDocumentRecovery({
  documentId,
  role,
  content = ''
}: UseEnhancedDocumentRecoveryProps) {
  const [hasAvailableBackup, setHasAvailableBackup] = useState<boolean>(false);
  const [lastBackupTime, setLastBackupTime] = useState<Date | null>(null);
  const [recoveryStats, setRecoveryStats] = useState<RecoveryStats>({
    backupsCreated: 0,
    recoveryAttempts: 0,
    successfulRecoveries: 0
  });
  const { isOnline } = useOnlineStatus();
  
  // Initialize recovery service
  useEffect(() => {
    if (documentId || role) {
      enhancedDocumentRecoveryService.initialize(
        documentId,
        'Document', // Use a default title until we know the actual one
        role,
        (timestamp) => setLastBackupTime(timestamp)
      );
      
      // Start auto backup with initial content if available
      if (content) {
        enhancedDocumentRecoveryService.startAutoBackup(content);
      }
    }
    
    return () => {
      enhancedDocumentRecoveryService.dispose();
    };
  }, [documentId, role]);
  
  // Check for available backups
  const checkForBackups = useCallback(() => {
    if (!documentId && !role) return false;
    
    const backupExists = enhancedDocumentRecoveryService.hasBackup();
    setHasAvailableBackup(backupExists);
    return backupExists;
  }, [documentId, role]);
  
  // Effect to check for backups when component mounts or deps change
  useEffect(() => {
    checkForBackups();
  }, [checkForBackups]);
  
  // Create backup manually (can be used to force backup before risky operations)
  const createBackup = useCallback((documentContent: string, metadata?: any) => {
    const backupCreated = enhancedDocumentRecoveryService.createBackup(documentContent, metadata);
    
    if (backupCreated) {
      setRecoveryStats(prev => ({
        ...prev,
        backupsCreated: prev.backupsCreated + 1
      }));
      setLastBackupTime(new Date());
    }
    
    return backupCreated;
  }, []);
  
  // Recover from backup
  const recoverFromBackup = useCallback((): Document | null => {
    try {
      setRecoveryStats(prev => ({
        ...prev,
        recoveryAttempts: prev.recoveryAttempts + 1
      }));
      
      const backup = enhancedDocumentRecoveryService.recoverFromBackup();
      
      if (backup) {
        setRecoveryStats(prev => ({
          ...prev,
          successfulRecoveries: prev.successfulRecoveries + 1
        }));
        
        toast.success("Document recovered", {
          description: "Your unsaved work has been restored from a local backup.",
          icon: <CheckCircle className="h-4 w-4" />,
        });
        
        return backup;
      }
      
      toast.error("Recovery failed", {
        description: "Could not recover document from backup.",
        icon: <AlertCircle className="h-4 w-4" />,
      });
      
      return null;
    } catch (error) {
      console.error("Error recovering from backup:", error);
      toast.error("Recovery failed", {
        description: "Could not recover backup. Please try manual recovery.",
      });
      return null;
    }
  }, [documentId, role]);
  
  // Clear backup after successful save
  const clearBackupAfterSave = useCallback(() => {
    if (documentId) {
      const removed = enhancedDocumentRecoveryService.clearBackup();
      if (removed) {
        setHasAvailableBackup(false);
      }
      return removed;
    }
    return false;
  }, [documentId]);
  
  // Handle errors with automatic recovery attempt
  const handleErrorWithRecovery = useCallback((error: unknown, context: string) => {
    return enhancedDocumentRecoveryService.handleErrorWithRecovery(error, context);
  }, []);
  
  // Create periodic backup of current content
  useEffect(() => {
    if (content && content.length > 0 && isOnline) {
      const backupInterval = setInterval(() => {
        createBackup(content);
      }, 60000); // Every minute
      
      return () => clearInterval(backupInterval);
    }
  }, [content, isOnline, createBackup]);
  
  return {
    hasAvailableBackup,
    lastBackupTime,
    checkForBackups,
    createBackup,
    recoverFromBackup,
    clearBackupAfterSave,
    handleErrorWithRecovery,
    recoveryStats
  };
}
