
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportProgressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  progress: number;
  status: 'processing' | 'success' | 'error';
  title: string;
  statusMessage?: string;
  errorMessage?: string;
}

export function ExportProgressDialog({
  isOpen,
  onClose,
  progress,
  status,
  title,
  statusMessage,
  errorMessage
}: ExportProgressDialogProps) {
  const [showDialog, setShowDialog] = useState(isOpen);
  
  useEffect(() => {
    setShowDialog(isOpen);
  }, [isOpen]);
  
  // Auto close on success after delay
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setShowDialog(false);
        onClose();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);
  
  return (
    <Dialog open={showDialog} onOpenChange={(open) => {
      setShowDialog(open);
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {status === 'processing' && (
            <ProgressBar
              value={progress}
              showPercentage
              label="Processing"
              statusMessage={statusMessage || "Please wait while your file is being processed..."}
              className="mt-2"
            />
          )}
          
          {status === 'success' && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Completed successfully!</span>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Error occurred</span>
              </div>
              
              {errorMessage && (
                <p className="text-sm text-red-600 mt-1 p-2 bg-red-50 border border-red-200 rounded">
                  {errorMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
