
/**
 * Utility for analyzing parameter errors and generating resolution suggestions
 */

// Define severity levels for parameter errors
export type ErrorSeverity = 'critical' | 'warning' | 'info';

// Structure for validation error suggestions
export interface ErrorResolutionSuggestion {
  errorMessage: string;
  severity: ErrorSeverity;
  suggestionText: string;
  exampleFix?: string;
}

/**
 * Analyze error message and generate appropriate severity level
 */
export function determineErrorSeverity(errorMessage: string): ErrorSeverity {
  const lowerMessage = errorMessage.toLowerCase();
  
  // Critical errors - validation failures that prevent functionality
  if (
    lowerMessage.includes('required') || 
    lowerMessage.includes('missing') ||
    lowerMessage.includes('invalid') ||
    lowerMessage.includes('not match')
  ) {
    return 'critical';
  }
  
  // Warnings - potential issues that don't block functionality
  if (
    lowerMessage.includes('recommended') ||
    lowerMessage.includes('should be') ||
    lowerMessage.includes('better to') ||
    lowerMessage.includes('deprecated')
  ) {
    return 'warning';
  }
  
  // Info - suggestions or informational messages
  return 'info';
}

/**
 * Generate suggestions for fixing parameter errors
 */
export function generateSuggestions(
  paramName: string,
  errorMessage: string,
  currentValue: string
): ErrorResolutionSuggestion[] {
  const severity = determineErrorSeverity(errorMessage);
  const suggestions: ErrorResolutionSuggestion[] = [];
  const lowerMessage = errorMessage.toLowerCase();
  
  // Handle required parameter errors
  if (lowerMessage.includes('required') && (!currentValue || currentValue.trim() === '')) {
    suggestions.push({
      errorMessage,
      severity,
      suggestionText: `Parameter ${paramName} is required. Please provide a value.`,
      exampleFix: `example-${paramName}`
    });
  }
  
  // Handle type errors
  else if (lowerMessage.includes('must be numeric')) {
    suggestions.push({
      errorMessage,
      severity,
      suggestionText: `Parameter ${paramName} must be a number.`,
      exampleFix: currentValue ? '123' : '0'
    });
  }
  
  // Handle UUID format errors
  else if (lowerMessage.includes('valid uuid')) {
    suggestions.push({
      errorMessage,
      severity,
      suggestionText: `Parameter ${paramName} must be a valid UUID.`,
      exampleFix: '123e4567-e89b-12d3-a456-426614174000'
    });
  }
  
  // Handle email format errors
  else if (lowerMessage.includes('valid email')) {
    suggestions.push({
      errorMessage,
      severity,
      suggestionText: `Parameter ${paramName} must be a valid email address.`,
      exampleFix: 'example@domain.com'
    });
  }
  
  // Handle length constraints
  else if (lowerMessage.includes('at least')) {
    const minLength = parseInt(lowerMessage.match(/at least (\d+)/)?.[1] || '3');
    suggestions.push({
      errorMessage,
      severity,
      suggestionText: `Parameter ${paramName} is too short. It needs at least ${minLength} characters.`,
      exampleFix: currentValue.padEnd(minLength, 'a')
    });
  }
  else if (lowerMessage.includes('cannot exceed')) {
    const maxLength = parseInt(lowerMessage.match(/exceed (\d+)/)?.[1] || '10');
    suggestions.push({
      errorMessage,
      severity,
      suggestionText: `Parameter ${paramName} is too long. It must not exceed ${maxLength} characters.`,
      exampleFix: currentValue.substring(0, maxLength)
    });
  }
  
  // Handle pattern match errors
  else if (lowerMessage.includes('pattern')) {
    suggestions.push({
      errorMessage,
      severity,
      suggestionText: `Parameter ${paramName} doesn't match the required pattern.`,
      exampleFix: paramName === 'id' ? '123' : `valid-${paramName}`
    });
  }
  
  // Generic fallback suggestion
  if (suggestions.length === 0) {
    suggestions.push({
      errorMessage,
      severity,
      suggestionText: `Please review the value for parameter ${paramName}.`,
      exampleFix: undefined
    });
  }
  
  return suggestions;
}

// Helper function to generate suggestions from validation results
export function generateErrorSuggestionsFromResults(
  validationResults: Array<{ isValid: boolean; errorMessage?: string }>,
  currentValues: Record<string, string>
): Record<string, ErrorResolutionSuggestion[]> {
  const suggestions: Record<string, ErrorResolutionSuggestion[]> = {};
  
  validationResults.forEach(result => {
    if (!result.isValid && result.errorMessage) {
      // Extract parameter name from error message
      const paramMatch = result.errorMessage.match(/Parameter\s+(\w+)/i);
      if (paramMatch && paramMatch[1]) {
        const paramName = paramMatch[1];
        const currentValue = currentValues[paramName] || '';
        
        if (!suggestions[paramName]) {
          suggestions[paramName] = [];
        }
        
        suggestions[paramName].push(
          ...generateSuggestions(paramName, result.errorMessage, currentValue)
        );
      }
    }
  });
  
  return suggestions;
}
