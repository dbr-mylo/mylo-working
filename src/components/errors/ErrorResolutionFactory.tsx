
import React from 'react';
import { GuidedResolution } from './GuidedResolution';

/**
 * Create a guided error resolution component
 * @param error The error to resolve
 * @param resolutionSteps Steps to resolve the error
 */
export function createGuidedResolution(
  error: unknown, 
  resolutionSteps: string[]
): React.ReactElement {
  return <GuidedResolution error={error} resolutionSteps={resolutionSteps} />;
}

// Import the getErrorResolutionSteps function from utils
import { getErrorResolutionSteps } from '@/utils/error/errorResolution';

// Re-export for backward compatibility
export { getErrorResolutionSteps };
