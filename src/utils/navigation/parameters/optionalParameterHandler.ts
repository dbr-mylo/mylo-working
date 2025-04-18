
import { NavigationError } from '@/utils/navigation/types';

export interface OptionalParameterConfig {
  defaultValue?: string;
  isRequired: boolean;
  validator?: (value: string) => boolean;
}

export interface OptionalParameterResult {
  params: Record<string, string>;
  missingRequired: string[];
  errors: string[];
}

/**
 * Extracts parameters from a route pattern, handling optional parameters
 */
export const extractOptionalParameters = (
  pattern: string,
  actualPath: string
): OptionalParameterResult => {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = actualPath.split('/').filter(Boolean);
  const result: OptionalParameterResult = {
    params: {},
    missingRequired: [],
    errors: []
  };

  // Track current position in actual path
  let pathIndex = 0;

  for (let i = 0; i < patternParts.length; i++) {
    const part = patternParts[i];
    
    // Check if this is a parameter
    if (part.startsWith(':')) {
      const isOptional = part.endsWith('?');
      const paramName = part.slice(1, isOptional ? -1 : undefined);
      
      // Get the actual value if available
      const value = pathParts[pathIndex];
      
      if (!value && !isOptional) {
        result.missingRequired.push(paramName);
      } else if (value) {
        result.params[paramName] = value;
        pathIndex++;
      } else {
        // Optional parameter was omitted
        result.params[paramName] = '';
      }
    } else {
      // Static segment - must match
      if (part !== pathParts[pathIndex]) {
        result.errors.push(`Static segment mismatch: expected "${part}", got "${pathParts[pathIndex] || ''}"`);
      }
      pathIndex++;
    }
  }

  return result;
};

/**
 * Validates extracted parameters against their configuration
 */
export const validateOptionalParameters = (
  params: Record<string, string>,
  config: Record<string, OptionalParameterConfig>
): boolean => {
  for (const [param, settings] of Object.entries(config)) {
    const value = params[param];
    
    // Check required parameters
    if (settings.isRequired && !value) {
      return false;
    }
    
    // Apply validator if present
    if (settings.validator && value && !settings.validator(value)) {
      return false;
    }
    
    // Apply default value if needed
    if (!value && settings.defaultValue) {
      params[param] = settings.defaultValue;
    }
  }
  
  return true;
};

