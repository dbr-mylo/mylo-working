
import { NavigationError } from '@/utils/navigation/types';

export interface OptionalParameterConfig {
  defaultValue?: string;
  isRequired: boolean;
  validator?: (value: string) => boolean;
  type?: 'string' | 'number' | 'boolean';
  regex?: RegExp;
}

export interface OptionalParameterResult {
  params: Record<string, string>;
  missingRequired: string[];
  errors: string[];
  performance?: { 
    extractionTime: number;
    validationTime?: number;
  };
}

/**
 * Extracts parameters from a route pattern, handling optional parameters
 */
export const extractOptionalParameters = (
  pattern: string,
  actualPath: string
): OptionalParameterResult => {
  const startTime = performance.now();
  
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

  // Add performance metrics
  result.performance = {
    extractionTime: performance.now() - startTime
  };

  return result;
};

/**
 * Validates extracted parameters against their configuration
 */
export const validateOptionalParameters = (
  params: Record<string, string>,
  config: Record<string, OptionalParameterConfig>
): { isValid: boolean; validationErrors: string[] } => {
  const startTime = performance.now();
  const validationErrors: string[] = [];
  
  for (const [param, settings] of Object.entries(config)) {
    const value = params[param];
    
    // Check required parameters
    if (settings.isRequired && !value) {
      validationErrors.push(`Required parameter "${param}" is missing`);
      continue;
    }
    
    // Skip validation for empty optional parameters
    if (!value && !settings.isRequired) {
      // Apply default value if needed
      if (settings.defaultValue) {
        params[param] = settings.defaultValue;
      }
      continue;
    }
    
    // Apply validator if present
    if (settings.validator && value && !settings.validator(value)) {
      validationErrors.push(`Parameter "${param}" failed custom validation`);
    }
    
    // Type validation
    if (settings.type && value) {
      if (settings.type === 'number' && isNaN(Number(value))) {
        validationErrors.push(`Parameter "${param}" should be a number`);
      } else if (settings.type === 'boolean' && !['true', 'false'].includes(value.toLowerCase())) {
        validationErrors.push(`Parameter "${param}" should be a boolean`);
      }
    }
    
    // Regex validation
    if (settings.regex && value && !settings.regex.test(value)) {
      validationErrors.push(`Parameter "${param}" does not match required format`);
    }
  }
  
  return { 
    isValid: validationErrors.length === 0,
    validationErrors,
    performance: { validationTime: performance.now() - startTime }
  };
};

/**
 * Creates a configuration object for optional parameters from a route pattern
 */
export const createParameterConfigFromPattern = (
  pattern: string
): Record<string, OptionalParameterConfig> => {
  const config: Record<string, OptionalParameterConfig> = {};
  
  pattern.split('/').forEach(part => {
    if (part.startsWith(':')) {
      const isOptional = part.endsWith('?');
      const paramName = part.slice(1, isOptional ? -1 : undefined);
      
      config[paramName] = {
        isRequired: !isOptional,
        defaultValue: isOptional ? '' : undefined
      };
    }
  });
  
  return config;
};

/**
 * Builds the actual URL from a pattern and parameters
 */
export const buildUrlFromPattern = (
  pattern: string,
  params: Record<string, string>
): string => {
  let url = pattern;
  
  Object.entries(params).forEach(([key, value]) => {
    // Handle optional parameters
    const optionalRegex = new RegExp(`\/:${key}\\?(?:\\/|$)`, 'g');
    const requiredRegex = new RegExp(`\/:${key}(?:\\/|$)`, 'g');
    
    if (value) {
      // Replace both optional and required patterns
      url = url.replace(optionalRegex, `/${value}/`);
      url = url.replace(requiredRegex, `/${value}/`);
    } else {
      // Remove optional parameters if no value
      url = url.replace(optionalRegex, '/');
    }
  });
  
  // Clean up any double slashes and trailing slash
  url = url.replace(/\/+/g, '/').replace(/\/$/, '');
  if (url === '') url = '/';
  
  return url;
};

