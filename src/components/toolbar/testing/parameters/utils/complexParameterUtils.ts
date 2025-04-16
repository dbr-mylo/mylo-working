
/**
 * Utilities for handling complex parameter types in deep linking
 */

/**
 * Complex parameter types supported for deep linking
 */
export type ComplexParameterType = 'string' | 'number' | 'boolean' | 'array' | 'object';

/**
 * Complex parameter definition
 */
export interface ComplexParameter {
  key: string;
  type: ComplexParameterType;
  value: string | number | boolean | Array<any> | Record<string, any>;
}

/**
 * Convert complex parameter to string representation for URLs
 */
export const serializeParameter = (param: ComplexParameter): string => {
  const { type, value } = param;
  
  switch (type) {
    case 'string':
      return String(value);
    case 'number':
      return String(value);
    case 'boolean':
      return String(value);
    case 'array':
      return encodeURIComponent(JSON.stringify(value));
    case 'object':
      return encodeURIComponent(JSON.stringify(value));
    default:
      return String(value);
  }
};

/**
 * Parse string representation back to complex parameter
 */
export const deserializeParameter = (param: string, type: ComplexParameterType): any => {
  switch (type) {
    case 'string':
      return param;
    case 'number':
      return Number(param);
    case 'boolean':
      return param.toLowerCase() === 'true';
    case 'array':
      try {
        return JSON.parse(decodeURIComponent(param));
      } catch (e) {
        console.error('Error parsing array parameter:', e);
        return [];
      }
    case 'object':
      try {
        return JSON.parse(decodeURIComponent(param));
      } catch (e) {
        console.error('Error parsing object parameter:', e);
        return {};
      }
    default:
      return param;
  }
};

/**
 * Create a deep link with support for complex parameters
 */
export const createComplexDeepLink = (
  path: string,
  params: Record<string, any> = {},
  query: Record<string, any> = {}
): string => {
  let processedPath = path;
  
  // Replace path parameters
  Object.entries(params).forEach(([key, value]) => {
    let paramValue: string;
    
    if (Array.isArray(value)) {
      paramValue = encodeURIComponent(JSON.stringify(value));
    } else if (value !== null && typeof value === 'object') {
      paramValue = encodeURIComponent(JSON.stringify(value));
    } else {
      paramValue = encodeURIComponent(String(value));
    }
    
    processedPath = processedPath.replace(`:${key}`, paramValue);
  });
  
  // Build query string with support for arrays and objects
  const queryEntries = Object.entries(query).filter(([_, value]) => value !== undefined);
  
  if (queryEntries.length > 0) {
    const queryParts: string[] = [];
    
    queryEntries.forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle array values
        value.forEach((item, index) => {
          const arrayKey = `${key}[${index}]`;
          queryParts.push(`${encodeURIComponent(arrayKey)}=${encodeURIComponent(String(item))}`);
        });
      } else if (value !== null && typeof value === 'object') {
        // Handle object values
        Object.entries(value).forEach(([subKey, subValue]) => {
          const objectKey = `${key}[${subKey}]`;
          queryParts.push(`${encodeURIComponent(objectKey)}=${encodeURIComponent(String(subValue))}`);
        });
      } else {
        // Handle primitive values
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
      }
    });
    
    processedPath = `${processedPath}${processedPath.includes('?') ? '&' : '?'}${queryParts.join('&')}`;
  }
  
  return processedPath;
};

/**
 * Parse a URL to extract complex parameters
 */
export const parseComplexParameters = (url: string): {
  path: string;
  pathParams: Record<string, any>;
  queryParams: Record<string, any>;
} => {
  const [pathPart, queryPart] = url.split('?');
  const pathParams: Record<string, any> = {};
  const queryParams: Record<string, any> = {};
  
  // Extract query parameters
  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    const paramMap: Record<string, any> = {};
    
    searchParams.forEach((value, key) => {
      // Check for array or object notation: key[subkey]
      const arrayMatch = key.match(/^([^\[]+)\[(\d+|[^\]]+)\]$/);
      
      if (arrayMatch) {
        const [_, mainKey, subKey] = arrayMatch;
        
        if (!paramMap[mainKey]) {
          paramMap[mainKey] = Number.isInteger(Number(subKey)) ? [] : {};
        }
        
        if (Array.isArray(paramMap[mainKey])) {
          paramMap[mainKey][Number(subKey)] = value;
        } else {
          paramMap[mainKey][subKey] = value;
        }
      } else {
        // Handle regular key=value
        paramMap[key] = value;
      }
    });
    
    // Convert string values to appropriate types when possible
    Object.entries(paramMap).forEach(([key, value]) => {
      // Try to auto-detect types
      if (typeof value === 'string') {
        if (value === 'true') queryParams[key] = true;
        else if (value === 'false') queryParams[key] = false;
        else if (!isNaN(Number(value)) && value.trim() !== '') queryParams[key] = Number(value);
        else queryParams[key] = value;
      } else {
        queryParams[key] = value;
      }
    });
  }
  
  return {
    path: pathPart,
    pathParams,
    queryParams
  };
};

