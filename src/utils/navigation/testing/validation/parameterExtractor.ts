
import { ParameterValidationRule, ExtractValidateResult } from './types';
import { validateParameter } from './parameterValidator';

/**
 * Extract and validate parameters from a route
 * @param routePattern Route pattern with parameters
 * @param actualPath Actual path with values
 * @param validationRules Optional validation rules for parameters
 * @returns Extracted and validated parameters or null if invalid
 */
export function extractAndValidateParameters(
  routePattern: string,
  actualPath: string,
  validationRules?: Record<string, ParameterValidationRule>
): ExtractValidateResult {
  const startTime = performance.now();
  const errors: string[] = [];
  
  // Split into segments
  const patternSegments = routePattern.split('/').filter(Boolean);
  const pathSegments = actualPath.split('/').filter(Boolean);
  
  // Check if segment count matches (unless there are optional parameters)
  const hasOptionalParams = routePattern.includes('?');
  if (!hasOptionalParams && patternSegments.length !== pathSegments.length) {
    return {
      isValid: false,
      errors: ['Path segments do not match pattern'],
      performanceMetrics: {
        executionTime: performance.now() - startTime
      }
    };
  }
  
  // Extract parameters
  const params: Record<string, string> = {};
  const paramNames = new Set<string>();
  
  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    
    // Check if this is a parameter
    if (patternSegment.startsWith(':')) {
      // Get parameter name (remove : and optional ? marker)
      let paramName = patternSegment.substring(1);
      const isOptional = paramName.endsWith('?');
      if (isOptional) {
        paramName = paramName.substring(0, paramName.length - 1);
      }
      
      // Check for duplicate parameter names
      if (paramNames.has(paramName)) {
        errors.push(`Duplicate parameter name: ${paramName}`);
        continue;
      }
      
      paramNames.add(paramName);
      
      // Get parameter value
      const value = i < pathSegments.length ? pathSegments[i] : '';
      
      // Check if required parameter is missing
      if (!isOptional && !value) {
        errors.push(`Missing required parameter: ${paramName}`);
      }
      
      // Validate parameter if rules provided
      if (validationRules && validationRules[paramName]) {
        const validationResult = validateParameter(
          paramName,
          value,
          validationRules[paramName]
        );
        
        if (!validationResult.isValid) {
          errors.push(validationResult.errorMessage || `Invalid parameter: ${paramName}`);
        } else if (validationResult.sanitizedValue !== undefined) {
          params[paramName] = validationResult.sanitizedValue;
          continue;
        }
      }
      
      params[paramName] = value;
    }
    // If not a parameter, ensure static segments match
    else if (i < pathSegments.length && patternSegment !== pathSegments[i]) {
      errors.push(`Path segment mismatch: expected "${patternSegment}", got "${pathSegments[i]}"`);
    }
  }
  
  // Determine validity based on errors
  const isValid = errors.length === 0;
  
  return {
    isValid,
    params: isValid ? params : undefined,
    errors: errors.length > 0 ? errors : undefined,
    performanceMetrics: {
      executionTime: performance.now() - startTime
    }
  };
}
