
import React from "react";
import { X, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AuthError } from "@/lib/errors/auth";

interface AuthErrorDisplayProps {
  error: Error | null;
  onClear: () => void;
  onRetry?: () => void;
  className?: string;
}

export const AuthErrorDisplay: React.FC<AuthErrorDisplayProps> = ({
  error,
  onClear,
  onRetry,
  className = ""
}) => {
  if (!error) return null;
  
  // Determine if the error is recoverable
  const isRecoverable = error instanceof AuthError && error.isRecoverable();
  
  // Get appropriate message
  const errorMessage = error instanceof AuthError
    ? error.getUserMessage()
    : error.message;
  
  // Get recovery action if available
  const recoveryAction = error instanceof AuthError
    ? error.getRecoveryAction()
    : "Please try again.";
  
  return (
    <Alert variant="destructive" className={`mt-4 mb-2 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <div className="flex flex-col w-full">
        <div className="flex items-start justify-between">
          <AlertTitle className="text-sm font-medium">
            Authentication Error
          </AlertTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 rounded-full" 
            onClick={onClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
        <AlertDescription className="text-sm mt-1">
          {errorMessage}
        </AlertDescription>
        
        {isRecoverable && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-red-200">
            <span className="text-xs">{recoveryAction}</span>
            {onRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 px-2 text-xs border-red-200 hover:bg-red-50 hover:text-red-900"
                onClick={onRetry}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        )}
      </div>
    </Alert>
  );
};
