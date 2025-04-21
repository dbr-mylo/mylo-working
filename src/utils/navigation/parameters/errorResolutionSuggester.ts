
import { ValidationResult } from '../testing/validation/types';

export interface ErrorResolutionSuggestion {
  errorMessage: string;
  suggestionText: string;
  exampleFix?: string;
  severity: 'critical' | 'warning' | 'info';
}

/**
 * Generate suggestions for resolving parameter validation errors
 * @param error The validation error message
 * @param paramName The parameter name
 * @param value The current parameter value
 * @returns Error resolution suggestions
 */
export function generateErrorSuggestions(
  error: string,
  paramName: string,
  value: string
): ErrorResolutionSuggestion {
  // Parse the error message to identify the type of error
  if (error.includes('required')) {
    return {
      errorMessage: error,
      suggestionText: `Parameter ${paramName} is required. You must provide a value.`,
      exampleFix: 'Add a non-empty value for this parameter',
      severity: 'critical'
    };
  }
  
  if (error.includes('must be numeric')) {
    return {
      errorMessage: error,
      suggestionText: `Parameter ${paramName} must contain only digits.`,
      exampleFix: value ? `Try: ${value.replace(/\D/g, '') || '123'}` : '123',
      severity: 'critical'
    };
  }
  
  if (error.includes('UUID')) {
    return {
      errorMessage: error,
      suggestionText: `Parameter ${paramName} must be a valid UUID (e.g., 123e4567-e89b-12d3-a456-426614174000).`,
      exampleFix: '123e4567-e89b-12d3-a456-426614174000',
      severity: 'critical'
    };
  }
  
  if (error.includes('email')) {
    return {
      errorMessage: error,
      suggestionText: `Parameter ${paramName} must be a valid email address.`,
      exampleFix: 'example@example.com',
      severity: 'critical'
    };
  }
  
  if (error.includes('at least')) {
    const minLengthMatch = error.match(/at least (\d+)/);
    const minLength = minLengthMatch ? parseInt(minLengthMatch[1]) : 3;
    
    return {
      errorMessage: error,
      suggestionText: `Parameter ${paramName} must be at least ${minLength} characters long.`,
      exampleFix: value ? value.padEnd(minLength, value[0] || 'a') : 'a'.repeat(minLength),
      severity: 'warning'
    };
  }
  
  if (error.includes('cannot exceed')) {
    const maxLengthMatch = error.match(/cannot exceed (\d+)/);
    const maxLength = maxLengthMatch ? parseInt(maxLengthMatch[1]) : 10;
    
    return {
      errorMessage: error,
      suggestionText: `Parameter ${paramName} cannot exceed ${maxLength} characters.`,
      exampleFix: value ? value.substring(0, maxLength) : 'a'.repeat(Math.min(3, maxLength)),
      severity: 'warning'
    };
  }
  
  if (error.includes('pattern')) {
    return {
      errorMessage: error,
      suggestionText: `Parameter ${paramName} does not match the required pattern.`,
      severity: 'warning'
    };
  }
  
  // Default case for unrecognized errors
  return {
    errorMessage: error,
    suggestionText: `Parameter ${paramName} validation failed.`,
    severity: 'info'
  };
}

/**
 * Generate suggestions for multiple validation errors
 * @param results Validation results
 * @param params Current parameter values
 * @returns List of error resolution suggestions
 */
export function generateErrorSuggestionsFromResults(
  results: ValidationResult[],
  params: Record<string, string>
): Record<string, ErrorResolutionSuggestion[]> {
  const suggestions: Record<string, ErrorResolutionSuggestion[]> = {};
  
  results.forEach(result => {
    if (!result.isValid && result.errorMessage) {
      // Extract parameter name from error message
      const paramMatch = result.errorMessage.match(/Parameter (\w+)/);
      if (paramMatch && paramMatch[1]) {
        const paramName = paramMatch[1];
        
        if (!suggestions[paramName]) {
          suggestions[paramName] = [];
        }
        
        suggestions[paramName].push(
          generateErrorSuggestions(result.errorMessage, paramName, params[paramName] || '')
        );
      }
    }
  });
  
  return suggestions;
}
