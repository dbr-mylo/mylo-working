
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ExportProgressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  progress: number;
  status: 'processing' | 'success' | 'error';
  title: string;
  statusMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

/**
 * Dialog that displays export progress with accessibility support
 * 
 * @component
 * @example
 * ```tsx
 * <ExportProgressDialog
 *   isOpen={true}
 *   onClose={() => setDialogOpen(false)}
 *   progress={75}
 *   status="processing"
 *   title="Exporting PDF"
 *   statusMessage="Generating document..."
 * />
 * ```
 */
export function ExportProgressDialog({
  isOpen,
  onClose,
  progress,
  status,
  title,
  statusMessage,
  errorMessage,
  onRetry
}: ExportProgressDialogProps) {
  const [showDialog, setShowDialog] = useState(isOpen);
  
  // Update state when isOpen prop changes
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

  // Determine appropriate aria live region setting
  const ariaLive = status === 'error' ? 'assertive' : 'polite';
  
  // Generate screen reader text based on status
  const getStatusForScreenReader = () => {
    switch (status) {
      case 'processing':
        return `Export in progress: ${progress}% complete. ${statusMessage || ''}`;
      case 'success':
        return 'Export completed successfully.';
      case 'error':
        return `Export failed. ${errorMessage || 'An error occurred.'}`;
      default:
        return '';
    }
  };
  
  return (
    <Dialog open={showDialog} onOpenChange={(open) => {
      setShowDialog(open);
      if (!open) onClose();
    }}>
      <DialogContent 
        className="sm:max-w-md"
        aria-describedby="export-status"
        aria-labelledby="export-dialog-title"
      >
        <DialogHeader>
          <DialogTitle id="export-dialog-title">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* Status announcement for screen readers */}
          <div 
            id="export-status"
            className="sr-only" 
            aria-live={ariaLive}
            aria-atomic="true"
          >
            {getStatusForScreenReader()}
          </div>
          
          {status === 'processing' && (
            <ProgressBar
              value={progress}
              showPercentage
              label="Processing"
              statusMessage={statusMessage || "Please wait while your file is being processed..."}
              className="mt-2"
              ariaLabel={`Export progress: ${progress} percent complete`}
              id="export-progress-bar"
            />
          )}
          
          {status === 'success' && (
            <div 
              className="flex items-center space-x-2 text-green-600"
              role="status"
            >
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <span className="font-medium">Completed successfully!</span>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-2">
              <div 
                className="flex items-center space-x-2 text-red-600"
                role="alert"
              >
                <XCircle className="h-5 w-5" aria-hidden="true" />
                <span className="font-medium">Error occurred</span>
              </div>
              
              {errorMessage && (
                <div 
                  className="text-sm text-red-600 mt-1 p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2"
                  id="error-details"
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <p>{errorMessage}</p>
                </div>
              )}
              
              {onRetry && (
                <Button 
                  onClick={onRetry} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  aria-label="Retry export"
                >
                  Try again
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
