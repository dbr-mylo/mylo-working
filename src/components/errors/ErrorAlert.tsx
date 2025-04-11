
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { classifyError, ErrorCategory } from "@/utils/error/errorClassifier";
import { RecoveryOptions } from './RecoveryOptions';

interface ErrorAlertProps {
  error: unknown;
  context: string;
  title?: string;
  onRetry?: () => void;
  severity?: "default" | "destructive" | "info";
  feature?: string;
  showRecoveryOptions?: boolean;
  className?: string;
}

export function ErrorAlert({
  error,
  context,
  title = "An error occurred",
  onRetry,
  severity = "destructive",
  feature,
  showRecoveryOptions = false,
  className = "",
}: ErrorAlertProps) {
  // Classify error to determine UI presentation
  const classifiedError = classifyError(error, context);
  const errorMessage = classifiedError.message;
  
  // Determine if we should adjust the severity based on error category
  const alertSeverity = severity === "default" && classifiedError.category === ErrorCategory.NETWORK
    ? "info"
    : severity;
  
  return (
    <div className={className}>
      <Alert variant={alertSeverity}>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="flex flex-col">
          <span className="mb-2">{errorMessage}</span>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="self-start mt-2"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              Try again
            </Button>
          )}
        </AlertDescription>
      </Alert>
      
      {showRecoveryOptions && (
        <div className="mt-4">
          <RecoveryOptions
            error={error instanceof Error ? error : new Error(String(error))}
            onRetry={onRetry}
            context={context}
            feature={feature}
          />
        </div>
      )}
    </div>
  );
}
