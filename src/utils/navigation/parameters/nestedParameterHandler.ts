
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

  let pathIndex = 0;

  for (let i = 0; i < patternParts.length; i++) {
    const part = patternParts[i];
    
    if (part.startsWith(':')) {
      const isOptional = part.endsWith('?');
      const paramName = part.slice(1, isOptional ? -1 : undefined);
      const value = pathParts[pathIndex];
      
      if (!value && !isOptional) {
        result.missingRequired.push(paramName);
        // Check if any required child parameters exist
        const param = hierarchy[paramName];
        param.children.forEach(childName => {
          if (!hierarchy[childName].isOptional) {
            result.missingRequired.push(childName);
          }
        });
      } else if (value) {
        result.params[paramName] = value;
        pathIndex++;
      } else {
        result.params[paramName] = '';
        // Skip optional parameter and its children
        const param = hierarchy[paramName];
        param.children.forEach(childName => {
          result.params[childName] = '';
        });
      }
    } else {
      if (part !== pathParts[pathIndex]) {
        result.errors.push(`Static segment mismatch: expected "${part}", got "${pathParts[pathIndex] || ''}"`);
      }
      pathIndex++;
    }
  }

  result.performance.extractionTime = performance.now() - startTime;
  return result;
};

export const validateNestedParameters = (
  params: Record<string, string>,
  hierarchy: Record<string, NestedParameter>,
  rules?: Record<string, {
    type?: 'string' | 'number' | 'boolean';
    pattern?: RegExp;
    custom?: (value: string) => boolean;
  }>
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
      }
      
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`Parameter ${name} does not match required pattern`);
      }
      
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
