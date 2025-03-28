
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleSpecificErrorMessage } from '@/utils/errorHandling';

interface ErrorDisplayProps {
  error: unknown;
  context: string;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
}

export function ErrorDisplay({ 
  error, 
  context, 
  onRetry, 
  showRetry = true,
  className = '' 
}: ErrorDisplayProps) {
  const { role } = useAuth();
  
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : 'An unknown error occurred';
      
  const roleSpecificMessage = role 
    ? getRoleSpecificErrorMessage(error, role, context) 
    : errorMessage;

  return (
    <div className={`p-4 border border-red-200 bg-red-50 rounded-md ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="text-sm text-red-700 mt-1">{roleSpecificMessage}</p>
          
          {showRetry && onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="mt-3 text-xs h-7 px-2 bg-white border-red-300 text-red-700 hover:bg-red-50"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyStateWithError({ 
  title, 
  description, 
  error, 
  context,
  onRetry
}: {
  title: string;
  description: string;
  error: unknown;
  context: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4 max-w-md">{description}</p>
      
      <ErrorDisplay 
        error={error} 
        context={context} 
        onRetry={onRetry}
        className="max-w-md mx-auto mt-2"
      />
    </div>
  );
}
