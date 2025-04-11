
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, History, X } from "lucide-react";
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Document } from '@/lib/types';
import { useDocumentBackupRecovery } from '@/hooks/document/useDocumentBackupRecovery';

interface DocumentRecoveryNotificationProps {
  documentId: string | null;
  role: string | null;
  onRecoverDocument?: (document: Document) => void;
}

export function DocumentRecoveryNotification({
  documentId,
  role,
  onRecoverDocument,
}: DocumentRecoveryNotificationProps) {
  const [showNotification, setShowNotification] = useState(false);
  const { 
    hasAvailableBackup, 
    checkForBackups, 
    recoverFromBackup,
    clearBackupAfterSave 
  } = useDocumentBackupRecovery({ 
    documentId, 
    role: role as any 
  });

  // Check for backups on mount and whenever document ID changes
  useEffect(() => {
    const hasBackup = checkForBackups();
    setShowNotification(hasBackup);
  }, [documentId, checkForBackups]);

  const handleRecovery = () => {
    const recoveredDocument = recoverFromBackup();
    
    if (recoveredDocument && onRecoverDocument) {
      onRecoverDocument(recoveredDocument);
      setShowNotification(false);
      toast.success("Document recovered successfully", {
        description: `Recovered "${recoveredDocument.title}" from local backup.`,
        icon: <CheckCircle className="h-4 w-4" />,
      });
    } else {
      toast.error("Recovery failed", {
        description: "Could not recover document from backup.",
      });
    }
  };

  const dismissNotification = () => {
    setShowNotification(false);
  };

  if (!showNotification) {
    return null;
  }

  return (
    <Alert 
      className="mb-4 bg-yellow-50 border-yellow-200 text-yellow-800"
      data-testid="document-recovery-notification"
    >
      <AlertCircle className="h-5 w-5 text-yellow-600" />
      <div className="flex w-full justify-between items-start">
        <div>
          <AlertTitle className="text-yellow-800">Unsaved changes detected</AlertTitle>
          <AlertDescription className="text-yellow-700">
            We found a backup of this document from your last session.
            Would you like to recover it?
          </AlertDescription>
        </div>
        <div className="flex gap-2 mt-1">
          <Button
            size="sm"
            variant="outline"
            className="bg-white border-yellow-300 hover:bg-yellow-50 text-yellow-800"
            onClick={dismissNotification}
          >
            <X className="h-4 w-4 mr-1" />
            Dismiss
          </Button>
          <Button
            size="sm"
            variant="default"
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
            onClick={handleRecovery}
          >
            <History className="h-4 w-4 mr-1" />
            Recover
          </Button>
        </div>
      </div>
    </Alert>
  );
}
