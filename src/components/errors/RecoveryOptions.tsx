
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { runDiagnostics } from "@/utils/error/diagnostics";
import { RefreshCw, Home, Wrench, Flag } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorRecoverySteps } from '@/utils/error/handleError';

interface RecoveryOptionsProps {
  onRetry?: () => void;
  error?: Error | null;
  context?: string;
  feature?: string;
}

export const RecoveryOptions: React.FC<RecoveryOptionsProps> = ({ 
  onRetry, 
  error,
  context = 'unknown',
  feature
}) => {
  const navigate = useNavigate();
  const { role } = useAuth();
  
  // Get dynamic recovery steps based on error, role, and feature
  const recoverySteps = error 
    ? getErrorRecoverySteps(error, context, role, feature)
    : [];
  
  const handleRefresh = () => {
    toast.info("Refreshing application...");
    window.location.reload();
  };
  
  const handleDiagnostics = () => {
    toast.info("Running diagnostics...");
    const result = runDiagnostics();
    
    if (result) {
      toast.success("Diagnostics completed successfully");
    }
  };
  
  const handleGoHome = () => {
    toast.info("Returning to home page...");
    navigate('/');
  };
  
  const handleRetry = () => {
    if (onRetry) {
      toast.info("Retrying operation...");
      onRetry();
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recovery Options</h3>
      
      {/* Display custom recovery steps if available */}
      {recoverySteps.length > 0 && (
        <ul className="list-disc pl-5 mb-4 text-sm space-y-1">
          {recoverySteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Page
        </Button>
        
        {onRetry && (
          <Button 
            variant="outline" 
            onClick={handleRetry}
            className="w-full"
          >
            <Wrench className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={handleGoHome}
          className="w-full"
        >
          <Home className="h-4 w-4 mr-2" />
          Go to Home
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleDiagnostics}
          className="w-full"
        >
          <Flag className="h-4 w-4 mr-2" />
          Run Diagnostics
        </Button>
      </div>
      
      {error && (
        <div className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded border border-gray-200">
          <details>
            <summary className="cursor-pointer">Show technical details</summary>
            <pre className="mt-2 overflow-x-auto p-2">
              {error.name}: {error.message}
              {error.stack && (
                <div className="mt-1 text-gray-600">
                  {error.stack.split('\n').slice(1).join('\n')}
                </div>
              )}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};
