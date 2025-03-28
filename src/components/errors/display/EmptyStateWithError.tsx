
import React from 'react';
import { ErrorDisplay } from './ErrorDisplayBase';

interface EmptyStateWithErrorProps {
  title: string;
  description: string;
  error: unknown;
  context: string;
  onRetry?: () => void;
}

export function EmptyStateWithError({ 
  title, 
  description, 
  error, 
  context,
  onRetry
}: EmptyStateWithErrorProps) {
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
