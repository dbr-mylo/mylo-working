
import { ParameterValidationRule, ValidationResult } from './types';

/**
 * Validates a parameter based on a rule
 * @param name Parameter name
 * @param value Parameter value
 * @param rule Validation rule
 * @returns Validation result
 */
export function validateParameter(
  name: string,
  value: string,
  rule: ParameterValidationRule
): ValidationResult {
  // Check required
  if (rule.required && !value) {
    return {
      isValid: false,
      errorMessage: `Parameter ${name} is required`
    };
  }
  
  // Skip validation for optional empty parameters
  if (!rule.required && !value) {
    return {
      isValid: true,
      sanitizedValue: ''
    };
  }
  
  // Validate by type
  switch (rule.type) {
    case 'number':
      if (!/^\d+$/.test(value)) {
        return {
          isValid: false,
          errorMessage: `Parameter ${name} must be numeric`
        };
      }
      break;
      
    case 'uuid':
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidPattern.test(value)) {
        return {
          isValid: false,
          errorMessage: `Parameter ${name} must be a valid UUID`
        };
      }
      break;
      
    case 'email':
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return {
          isValid: false,
          errorMessage: `Parameter ${name} must be a valid email`
        };
      }
      break;
  }
  
  // Check length constraints
  if (rule.minLength !== undefined && value.length < rule.minLength) {
    return {
      isValid: false,
      errorMessage: `Parameter ${name} must be at least ${rule.minLength} characters`
    };
  }
  
  if (rule.maxLength !== undefined && value.length > rule.maxLength) {
    return {
      isValid: false,
      errorMessage: `Parameter ${name} cannot exceed ${rule.maxLength} characters`
    };
  }
  
  // Check custom pattern
  if (rule.pattern && !rule.pattern.test(value)) {
    return {
      isValid: false,
      errorMessage: `Parameter ${name} does not match required pattern`
    };
  }
  
  // Check custom validator
  if (rule.customValidator && !rule.customValidator(value)) {
    return {
      isValid: false,
      errorMessage: `Parameter ${name} failed custom validation`
    };
  }
  
  // Passed all validations
  return {
    isValid: true,
    sanitizedValue: value
  };
}
