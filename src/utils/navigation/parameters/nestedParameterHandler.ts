
import type { NestedParameter, NestedParameterResult, ValidationRule } from './types';
import { ValidationRuleBuilder } from './ValidationRuleBuilder';
import { detectCyclicalDependencies } from './utils';

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

  detectCyclicalDependencies(hierarchy);

  return hierarchy;
};

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
      if (result.params[name] && !result.params[param.parent]) {
        result.errors.push(`Parameter "${name}" requires parent parameter "${param.parent}"`);
      }
      
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
      if (rule.type === 'number' && isNaN(Number(value))) {
        errors.push(`Parameter ${name} must be a number`);
      } else if (rule.type === 'boolean' && !['true', 'false'].includes(value.toLowerCase())) {
        errors.push(`Parameter ${name} must be a boolean`);
      }
      
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`Parameter ${name} does not match required pattern`);
      }
      
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        errors.push(`Parameter ${name} must be at least ${rule.minLength} characters long`);
      }
      
      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        errors.push(`Parameter ${name} cannot exceed ${rule.maxLength} characters`);
      }
      
      if (rule.custom && !rule.custom(value)) {
        errors.push(`Parameter ${name} failed custom validation`);
      }
    }

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

export { ValidationRuleBuilder };
export type { NestedParameter, NestedParameterResult, ValidationRule };
