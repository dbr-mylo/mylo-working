
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ErrorDisplay } from './ErrorDisplayBase';

interface RecoverableErrorStateProps {
  title: string;
  error: unknown;
  context: string;
  onRetry: () => void;
  children?: React.ReactNode;
}

export function RecoverableErrorState({
  title,
  error,
  context,
  onRetry,
  children,
}: RecoverableErrorStateProps) {
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
