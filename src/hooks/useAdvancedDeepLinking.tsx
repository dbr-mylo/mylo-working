import { useCallback } from 'react';
import { useDeepLinking } from './navigation/useDeepLinking';
import { toast } from 'sonner';

/**
 * Advanced deep linking hook with support for complex data types
 */
export const useAdvancedDeepLinking = () => {
  const { createDeepLink, navigateToDeepLink, parseDeepLink } = useDeepLinking();
  
  /**
   * Create a deep link with support for complex data structures
   * @param path Base path pattern
   * @param params Path parameters
   * @param complexQuery Query with support for arrays and objects
   * @returns Generated deep link or null if error
   */
  const createComplexDeepLink = useCallback((
    path: string,
    params: Record<string, string> = {},
    complexQuery: Record<string, any> = {}
  ): string | null => {
    try {
      // Process complex query parameters
      const processedQuery: Record<string, any> = {};
      
      // Handle complex data types
      for (const [key, value] of Object.entries(complexQuery)) {
        if (value === null || value === undefined) {
          continue;
        }
        
        if (Array.isArray(value)) {
          // Keep arrays as-is, the base createDeepLink handles them
          processedQuery[key] = value;
        } 
        else if (typeof value === 'object') {
          // Convert objects to JSON strings
          processedQuery[key] = JSON.stringify(value);
        } 
        else {
          processedQuery[key] = value;
        }
      }
      
      return createDeepLink(path, params, processedQuery);
    } catch (error) {
      console.error('Error in createComplexDeepLink:', error);
      toast.error('Error creating complex deep link', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }, [createDeepLink]);
  
  /**
   * Parse a deep link with support for complex data types
   * @param pattern Route pattern
   * @param path Actual path
   * @returns Parsed parameters or null if not matching
   */
  const parseComplexParameters = useCallback((
    path: string
  ): { pathParams: Record<string, string>; queryParams: Record<string, any> } | null => {
    try {
      // Extract the base path without query string
      const [basePath, queryString] = path.split('?');
      
      // Find matching route pattern
      const patterns = [
        // Add common patterns to check
        '/editor/:documentId',
        '/admin/:section',
        '/user/:id/:name',
        '/org/:orgId/team/:teamId/project/:projectId/task/:taskId',
        '/search/:query',
        '/filter/:type',
        // Add more patterns as needed
      ];
      
      // Try each pattern until we find a match
      for (const pattern of patterns) {
        const result = parseDeepLink(pattern, basePath);
        
        if (result !== null) {
          // Process query parameters for complex types
          const processedQuery: Record<string, any> = {};
          
          for (const [key, value] of Object.entries(result.query)) {
            // Try to parse JSON for object parameters
            if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
              try {
                processedQuery[key] = JSON.parse(value);
              } catch {
                processedQuery[key] = value;
              }
            } 
            // Process array parameters
            else if (Array.isArray(value)) {
              processedQuery[key] = value.map(item => {
                if (typeof item === 'string' && item.startsWith('{') && item.endsWith('}')) {
                  try {
                    return JSON.parse(item);
                  } catch {
                    return item;
                  }
                }
                return item;
              });
            } 
            else {
              processedQuery[key] = value;
            }
          }
          
          return {
            pathParams: result.params,
            queryParams: processedQuery
          };
        }
      }
      
      // No matching pattern found
      return null;
    } catch (error) {
      console.error('Error in parseComplexParameters:', error);
      toast.error('Error parsing complex parameters', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }, [parseDeepLink]);
  
  /**
   * Navigate to a complex deep link
   * @param path Base path pattern
   * @param params Path parameters
   * @param complexQuery Query with support for arrays and objects
   * @returns Boolean indicating if navigation was successful
   */
  const navigateToComplexDeepLink = useCallback((
    path: string,
    params: Record<string, string> = {},
    complexQuery: Record<string, any> = {}
  ): boolean => {
    const deepLink = createComplexDeepLink(path, params, complexQuery);
    
    if (!deepLink) {
      return false;
    }
    
    return navigateToDeepLink(path, params, complexQuery);
  }, [createComplexDeepLink, navigateToDeepLink]);
  
  return {
    createComplexDeepLink,
    parseComplexParameters,
    navigateToComplexDeepLink,
    // Re-export base functions
    createDeepLink,
    navigateToDeepLink,
    parseDeepLink
  };
};
