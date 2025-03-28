import React, { useState } from 'react';
import { AlertCircle, RefreshCw, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleSpecificErrorMessage } from "@/utils/error/roleSpecificErrors";
import { getErrorResolutionSteps } from "@/utils/error/errorResolution";
import { createGuidedResolution } from "@/components/errors/ErrorResolutionFactory";

interface ErrorDisplayProps {
  error: unknown;
  context: string;
  onRetry?: () => void;
  showRetry?: boolean;
  showResolution?: boolean;
  className?: string;
}

export function ErrorDisplay({ 
  error, 
  context, 
  onRetry, 
  showRetry = true,
  showResolution = true,
  className = '' 
}: ErrorDisplayProps) {
  const { role } = useAuth();
  const [showGuide, setShowGuide] = useState(false);
  
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : 'An unknown error occurred';
      
  const roleSpecificMessage = role 
    ? getRoleSpecificErrorMessage(error, role, context) 
    : errorMessage;
    
  const resolutionSteps = getErrorResolutionSteps(error, context);

  return (
    <div className={`p-4 border border-red-200 bg-red-50 rounded-md ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="text-sm text-red-700 mt-1">{roleSpecificMessage}</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {showRetry && onRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry}
                className="text-xs h-7 px-2 bg-white border-red-300 text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
            
            {showResolution && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGuide(!showGuide)}
                className="text-xs h-7 px-2 bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <HelpCircle className="h-3 w-3 mr-1" />
                {showGuide ? 'Hide Help' : 'Show Help'}
                {showGuide ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
            )}
          </div>
          
          {showGuide && showResolution && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="text-xs font-medium text-blue-800 mb-1">How to resolve this issue:</h4>
              <ol className="pl-5 list-decimal text-xs text-blue-700">
                {resolutionSteps.map((step, index) => (
                  <li key={index} className="mt-1">{step}</li>
                ))}
              </ol>
            </div>
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

export function RecoverableErrorState({
  title,
  error,
  context,
  onRetry,
  children,
}: {
  title: string;
  error: unknown;
  context: string;
  onRetry: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-red-200 p-4">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <h3 className="font-medium text-red-900">{title}</h3>
        </div>
        
        <ErrorDisplay
          error={error}
          context={context}
          onRetry={onRetry}
          className="border-0 p-0 bg-transparent"
        />
        
        {children && (
          <div className="pt-2 border-t border-red-200">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
