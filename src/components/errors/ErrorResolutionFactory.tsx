
import React from 'react';
import { GuidedResolution } from './GuidedResolution';

/**
 * Create a guided error resolution component
 * @param error The error to resolve
 * @param context The context where the error occurred
 * @param feature Optional feature context
 */
export function createGuidedResolution(
  error: unknown, 
  context: string,
  feature?: string
): React.ReactElement {
  return <GuidedResolution error={error} context={context} feature={feature} />;
}

// Import the getErrorResolutionSteps function from utils
import { getErrorResolutionSteps } from '@/utils/error/errorResolution';

// Re-export for backward compatibility
export { getErrorResolutionSteps };
