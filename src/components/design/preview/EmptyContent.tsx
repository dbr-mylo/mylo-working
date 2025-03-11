
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyContentProps {
  message?: string;
  className?: string;
}

export const EmptyContent: React.FC<EmptyContentProps> = ({ 
  message = "No content available", 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-gray-500 ${className}`}>
      <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
      <p className="text-sm text-center">{message}</p>
    </div>
  );
};
