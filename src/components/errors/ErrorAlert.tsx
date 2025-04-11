
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserFriendlyErrorMessage } from "@/utils/error/errorClassifier";
import { useAuth } from "@/contexts/AuthContext";

export type ErrorSeverity = "error" | "warning" | "info";

interface ErrorAlertProps {
  error: unknown;
  context: string;
  title?: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  severity?: ErrorSeverity;
  className?: string;
  showDetails?: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  context,
  title,
  onDismiss,
  onRetry,
  severity = "error",
  className = "",
  showDetails = false,
}) => {
  const { role } = useAuth();
  const errorMessage = getUserFriendlyErrorMessage(error, context, role);
  
  // Set icon based on severity
  const getIcon = () => {
    switch (severity) {
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      case "error":
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  // Set variant based on severity
  const getVariant = () => {
    switch (severity) {
      case "warning":
        return "warning" as const; // Adding as const to ensure TypeScript understands this as a literal
      case "info":
        return "default" as const;
      case "error":
      default:
        return "destructive" as const;
    }
  };
  
  // Get the error title
  const alertTitle = title || (severity === "error" 
    ? "An error occurred" 
    : severity === "warning" 
      ? "Warning" 
      : "Information");
  
  return (
    <Alert variant={getVariant()} className={`relative ${className}`}>
      {onDismiss && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-6 w-6" 
          onClick={onDismiss}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Dismiss</span>
        </Button>
      )}
      
      <div className="flex items-center gap-2">
        {getIcon()}
        <AlertTitle>{alertTitle}</AlertTitle>
      </div>
      
      <AlertDescription className="mt-2">
        {errorMessage}
      </AlertDescription>
      
      {showDetails && error instanceof Error && error.stack && (
        <details className="mt-2">
          <summary className="text-xs cursor-pointer">Technical details</summary>
          <pre className="mt-2 text-xs overflow-auto p-2 bg-secondary rounded-md">
            {error.stack}
          </pre>
        </details>
      )}
      
      {onRetry && (
        <div className="mt-3">
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </Alert>
  );
};
