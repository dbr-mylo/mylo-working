
interface NestedParameter {
  name: string;
  isOptional: boolean;
  parent?: string;
  children: string[];
  level: number;
}

interface NestedParameterResult {
  params: Record<string, string>;
  hierarchy: Record<string, NestedParameter>;
  missingRequired: string[];
  errors: string[];
  performance: {
    extractionTime: number;
    validationTime?: number;
  };
}

type ValidationRule = {
  type?: 'string' | 'number' | 'boolean';
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
};

/**
 * Parse a route pattern to extract nested parameter relationships
 */
export const parseNestedPattern = (pattern: string): Record<string, NestedParameter> => {
  const segments = pattern.split('/').filter(Boolean);
  const hierarchy: Record<string, NestedParameter> = {};
  let lastParam: string | undefined;
  let level = 0;

  segments.forEach((segment) => {
    if (segment.startsWith(':')) {
      const isOptional = segment.endsWith('?');
      const name = segment.slice(1, isOptional ? -1 : undefined);
      
      hierarchy[name] = {
        name,
        isOptional,
        parent: lastParam,
        children: [],
        level
      };
      
      if (lastParam) {
        hierarchy[lastParam].children.push(name);
      }
      
      lastParam = name;
      level++;
    } else {
      level = 0;
      lastParam = undefined;
    }
  });

  // Detect and mark cyclical dependencies
  detectCyclicalDependencies(hierarchy);

  return hierarchy;
};

/**
 * Detect cyclical dependencies in the parameter hierarchy
 */
const detectCyclicalDependencies = (hierarchy: Record<string, NestedParameter>): string[] => {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycles: string[] = [];

  const dfs = (paramName: string, path: string[] = []): boolean => {
    if (recursionStack.has(paramName)) {
      const cycle = [...path.slice(path.indexOf(paramName)), paramName];
      cycles.push(cycle.join(' → '));
      return true;
    }
    
    if (visited.has(paramName)) return false;
    
    visited.add(paramName);
    recursionStack.add(paramName);
    
    const param = hierarchy[paramName];
    if (param.parent && dfs(param.parent, [...path, paramName])) {
      return true;
    }
    
    for (const child of param.children) {
      if (dfs(child, [...path, paramName])) {
        return true;
      }
    }
    
    recursionStack.delete(paramName);
    return false;
  };

  Object.keys(hierarchy).forEach(paramName => {
    if (!visited.has(paramName)) {
      dfs(paramName);
    }
  });

  return cycles;
};

/**
 * Extract nested parameters from a route pattern and actual path
 */
export const extractNestedParameters = (
  pattern: string,
  actualPath: string
): NestedParameterResult => {
  const startTime = performance.now();
  const hierarchy = parseNestedPattern(pattern);
  
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = actualPath.split('/').filter(Boolean);
  
  const result: NestedParameterResult = {
    params: {},
    hierarchy,
    missingRequired: [],
    errors: [],
    performance: {
      extractionTime: 0
    }
  };

  // Map to track which segments in the path we've already processed
  const processedPathIndices = new Set<number>();
  
  // First pass: process direct pattern matches
  for (let i = 0, pathIndex = 0; i < patternParts.length && pathIndex < pathParts.length; i++) {
    const part = patternParts[i];
    
    // Skip static segments
    if (!part.startsWith(':')) {
      if (part !== pathParts[pathIndex]) {
        result.errors.push(`Static segment mismatch: expected "${part}", got "${pathParts[pathIndex] || ''}"`);
      }
      pathIndex++;
      processedPathIndices.add(pathIndex - 1);
      continue;
    }
    
    const isOptional = part.endsWith('?');
    const paramName = part.slice(1, isOptional ? -1 : undefined);
    const value = pathParts[pathIndex];
    
    if (value) {
      result.params[paramName] = value;
      processedPathIndices.add(pathIndex);
      pathIndex++;
    } else if (!isOptional) {
      result.missingRequired.push(paramName);
    } else {
      result.params[paramName] = '';
    }
  }
  
  // Second pass: validate parent-child relationships
  Object.entries(hierarchy).forEach(([name, param]) => {
    if (param.parent) {
      // If we have a value for this parameter but not for its parent, that's an error
      if (result.params[name] && !result.params[param.parent]) {
        result.errors.push(`Parameter "${name}" requires parent parameter "${param.parent}"`);
      }
      
      // If parent is missing and required, add child to missing required
      if (!result.params[param.parent] && !hierarchy[param.parent].isOptional && !result.missingRequired.includes(name)) {
        result.missingRequired.push(name);
      }
    }
  });
  
  // Check for unprocessed path segments
  const unprocessedSegments = pathParts.filter((_, index) => !processedPathIndices.has(index));
  if (unprocessedSegments.length > 0) {
    result.errors.push(`Unexpected path segments: ${unprocessedSegments.join(', ')}`);
  }

  result.performance.extractionTime = performance.now() - startTime;
  return result;
};

/**
 * Validate parameters against validation rules
 */
export const validateNestedParameters = (
  params: Record<string, string>,
  hierarchy: Record<string, NestedParameter>,
  rules?: Record<string, ValidationRule>
) => {
  const startTime = performance.now();
  const errors: string[] = [];

  Object.entries(hierarchy).forEach(([name, param]) => {
    const value = params[name];
    const rule = rules?.[name];

    if (!param.isOptional && !value) {
      errors.push(`Missing required parameter: ${name}`);
    }

    if (value && rule) {
      // Type validation
      if (rule.type === 'number' && isNaN(Number(value))) {
        errors.push(`Parameter ${name} must be a number`);
      } else if (rule.type === 'boolean' && !['true', 'false'].includes(value.toLowerCase())) {
        errors.push(`Parameter ${name} must be a boolean`);
      }
      
      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`Parameter ${name} does not match required pattern`);
      }
      
      // Length validation
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        errors.push(`Parameter ${name} must be at least ${rule.minLength} characters long`);
      }
      
      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        errors.push(`Parameter ${name} cannot exceed ${rule.maxLength} characters`);
      }
      
      // Custom validation
      if (rule.custom && !rule.custom(value)) {
        errors.push(`Parameter ${name} failed custom validation`);
      }
    }

    // Validate parent-child relationships
    if (value && param.parent && !params[param.parent]) {
      errors.push(`Parameter ${name} requires parent parameter ${param.parent}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    performance: {
      validationTime: performance.now() - startTime
    }
  };
};

/**
 * Create a validation rule builder for nested parameters
 */
export class ValidationRuleBuilder {
  private rule: ValidationRule = {};
  
  constructor() {
    this.rule = {
      required: false
    };
  }
  
  /**
   * Set parameter as required
   */
  required(): ValidationRuleBuilder {
    this.rule.required = true;
    return this;
  }
  
  /**
   * Set parameter as optional
   */
  optional(): ValidationRuleBuilder {
    this.rule.required = false;
    return this;
  }
  
  /**
   * Validate as string
   */
  string(): ValidationRuleBuilder {
    this.rule.type = 'string';
    return this;
  }
  
  /**
   * Validate as number
   */
  number(): ValidationRuleBuilder {
    this.rule.type = 'number';
    return this;
  }
  
  /**
   * Validate as boolean
   */
  boolean(): ValidationRuleBuilder {
    this.rule.type = 'boolean';
    return this;
  }
  
  /**
   * Set minimum length
   */
  minLength(length: number): ValidationRuleBuilder {
    this.rule.minLength = length;
    return this;
  }
  
  /**
   * Set maximum length
   */
  maxLength(length: number): ValidationRuleBuilder {
    this.rule.maxLength = length;
    return this;
  }
  
  /**
   * Set regex pattern
   */
  pattern(regex: RegExp): ValidationRuleBuilder {
    this.rule.pattern = regex;
    return this;
  }
  
  /**
   * Add custom validator
   */
  custom(validator: (value: string) => boolean): ValidationRuleBuilder {
    this.rule.custom = validator;
    return this;
  }
  
  /**
   * Common validation presets
   */
  static presets = {
    /**
     * UUID validation
     */
    uuid(): ValidationRuleBuilder {
      return new ValidationRuleBuilder()
        .pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    },
    
    /**
     * Email validation
     */
    email(): ValidationRuleBuilder {
      return new ValidationRuleBuilder()
        .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    },
    
    /**
     * Slug validation (lowercase letters, numbers, hyphens)
     */
    slug(): ValidationRuleBuilder {
      return new ValidationRuleBuilder()
        .pattern(/^[a-z0-9-]+$/);
    },
    
    /**
     * Date validation (YYYY-MM-DD)
     */
    date(): ValidationRuleBuilder {
      return new ValidationRuleBuilder()
        .pattern(/^\d{4}-\d{2}-\d{2}$/);
    }
  };
  
  /**
   * Build the validation rule
   */
  build(): ValidationRule {
    return { ...this.rule };
  }
}
