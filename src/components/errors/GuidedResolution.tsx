
import React from 'react';

export interface GuidedResolutionProps {
  error: unknown;
  resolutionSteps: string[];
}

/**
 * A component that displays guided resolution steps for errors
 */
export const GuidedResolution: React.FC<GuidedResolutionProps> = ({ 
  resolutionSteps 
}) => {
  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <h3 className="text-sm font-medium text-blue-800">How to resolve this issue:</h3>
      <ol className="mt-2 pl-5 list-decimal text-sm text-blue-700 space-y-1">
        {resolutionSteps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
};
