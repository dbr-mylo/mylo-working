
/**
 * Route utility functions
 */

/**
 * Extract parameters from a route path
 * @param definedPath Route path with parameters (e.g., "/user/:id")
 * @param actualPath Actual path with values (e.g., "/user/123")
 * @returns Object with extracted parameters or null if paths don't match
 */
export const extractPathParameters = (definedPath: string, actualPath: string): Record<string, string> | null => {
  // Split paths into segments
  const definedSegments = definedPath.split('/').filter(Boolean);
  const actualSegments = actualPath.split('/').filter(Boolean);
  
  // Check if segment counts match
  if (definedSegments.length !== actualSegments.length) {
    return null;
  }
  
  const params: Record<string, string> = {};
  
  // Compare segments and extract parameters
  for (let i = 0; i < definedSegments.length; i++) {
    const definedSegment = definedSegments[i];
    const actualSegment = actualSegments[i];
    
    // If segment is a parameter, extract it
    if (definedSegment.startsWith(':')) {
      const paramName = definedSegment.substring(1);
      params[paramName] = actualSegment;
    } 
    // If segments don't match and it's not a parameter, paths don't match
    else if (definedSegment !== actualSegment) {
      return null;
    }
  }
  
  return params;
};

/**
 * Parse a URL query string into an object
 * @param queryString Query string (e.g., "?key=value&other=123")
 * @returns Object with query parameters
 */
export const parseQueryParams = (queryString: string): Record<string, string> => {
  if (!queryString || !queryString.startsWith('?')) {
    return {};
  }
  
  // Remove the leading ? and split by &
  const params = queryString.substring(1).split('&');
  const result: Record<string, string> = {};
  
  // Process each parameter
  params.forEach(param => {
    const [key, value] = param.split('=');
    if (key) {
      result[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
    }
  });
  
  return result;
};

/**
 * Build a URL with query parameters
 * @param basePath Base URL path
 * @param params Object with query parameters
 * @returns URL with query parameters
 */
export const buildUrlWithParams = (basePath: string, params: Record<string, string>): string => {
  const queryParams = new URLSearchParams();
  
  // Add parameters to query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  
  // Return URL with query parameters if any
  if (queryString) {
    return `${basePath}?${queryString}`;
  }
  
  return basePath;
};

/**
 * Create a deep link to a specific location in the application
 * @param path Base path
 * @param params Route parameters
 * @param query Query parameters
 * @returns Deep link URL
 */
export const createDeepLink = (
  path: string, 
  params: Record<string, string> = {}, 
  query: Record<string, string> = {}
): string => {
  // Replace route parameters
  let processedPath = path;
  Object.entries(params).forEach(([key, value]) => {
    processedPath = processedPath.replace(`:${key}`, encodeURIComponent(value));
  });
  
  // Add query parameters
  return buildUrlWithParams(processedPath, query);
};
