
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationErrorType } from '@/utils/navigation/types';
import { navigationService } from '@/services/navigation/NavigationService';
import { showNavigationErrorToast } from '@/utils/navigation/errorHandling';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook to handle deep linking with enhanced error handling
 */
export const useDeepLinking = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { toast } = useToast();
  
  /**
   * Create a deep link with error handling
   * @param path Base path pattern
   * @param params Path parameters
   * @param query Query parameters
   * @returns Generated deep link or null if error
   */
  const createDeepLink = useCallback((
    path: string,
    params: Record<string, string> = {},
    query: Record<string, any> = {}
  ): string | null => {
    try {
      // Check if the path pattern exists in our routes
      const isValidPattern = navigationService.validateRoute(path, role);
      
      if (!isValidPattern) {
        // Handle invalid route pattern
        showNavigationErrorToast({
          type: NavigationErrorType.NOT_FOUND,
          path,
          message: `Route pattern ${path} is not defined in the application`,
          role
        });
        return null;
      }
      
      // Replace path parameters
      let finalPath = path;
      
      for (const [key, value] of Object.entries(params)) {
        const pattern = `:${key}`;
        
        if (!finalPath.includes(pattern)) {
          // Parameter doesn't exist in path
          showNavigationErrorToast({
            type: NavigationErrorType.VALIDATION_ERROR,
            path,
            message: `Parameter ${key} not found in path pattern`,
            role
          });
          return null;
        }
        
        finalPath = finalPath.replace(pattern, encodeURIComponent(value));
      }
      
      // Check if all parameters are replaced
      if (finalPath.includes(':')) {
        // Missing parameters
        const missingParams = finalPath.match(/:[a-zA-Z0-9_]+/g);
        showNavigationErrorToast({
          type: NavigationErrorType.VALIDATION_ERROR,
          path,
          message: `Missing required parameters: ${missingParams?.join(', ')}`,
          role
        });
        return null;
      }
      
      // Add query parameters
      if (Object.keys(query).length > 0) {
        const queryParams = new URLSearchParams();
        
        for (const [key, value] of Object.entries(query)) {
          if (value !== null && value !== undefined) {
            if (Array.isArray(value)) {
              // Handle array parameters
              value.forEach(item => {
                queryParams.append(`${key}[]`, String(item));
              });
            } else if (typeof value === 'object') {
              // Handle object parameters
              queryParams.append(key, JSON.stringify(value));
            } else {
              queryParams.append(key, String(value));
            }
          }
        }
        
        finalPath += `?${queryParams.toString()}`;
      }
      
      return finalPath;
    } catch (error) {
      // Handle unexpected errors
      console.error('Error creating deep link:', error);
      
      showNavigationErrorToast({
        type: NavigationErrorType.SERVER_ERROR,
        path,
        message: error instanceof Error ? error.message : 'Unknown error creating deep link',
        role
      });
      
      return null;
    }
  }, [role]);
  
  /**
   * Navigate to a deep link with error handling
   * @param path Base path pattern
   * @param params Path parameters
   * @param query Query parameters
   * @returns Boolean indicating if navigation was successful
   */
  const navigateToDeepLink = useCallback((
    path: string,
    params: Record<string, string> = {},
    query: Record<string, any> = {}
  ): boolean => {
    const deepLink = createDeepLink(path, params, query);
    
    if (!deepLink) {
      return false;
    }
    
    try {
      // Navigate to the generated deep link
      navigate(deepLink);
      return true;
    } catch (error) {
      // Handle navigation errors
      console.error('Error navigating to deep link:', error);
      
      showNavigationErrorToast({
        type: NavigationErrorType.SERVER_ERROR,
        path: deepLink,
        message: error instanceof Error ? error.message : 'Unknown error during navigation',
        role
      });
      
      return false;
    }
  }, [navigate, createDeepLink, role]);
  
  /**
   * Parse a deep link to extract parameters
   * @param pattern Route pattern
   * @param path Actual path
   * @returns Extracted parameters or null if not matching
   */
  const parseDeepLink = useCallback((
    pattern: string,
    path: string
  ): { params: Record<string, string>, query: Record<string, any> } | null => {
    try {
      // Extract path parameters
      const params = navigationService.extractRouteParameters(pattern, path);
      
      if (params === null) {
        return null;
      }
      
      // Extract query parameters
      const query: Record<string, any> = {};
      const urlObj = new URL(path, 'http://example.com');
      
      urlObj.searchParams.forEach((value, key) => {
        // Handle array parameters
        if (key.endsWith('[]')) {
          const baseKey = key.substring(0, key.length - 2);
          if (!query[baseKey]) {
            query[baseKey] = [];
          }
          query[baseKey].push(value);
        } 
        // Handle JSON object parameters
        else if (value.startsWith('{') && value.endsWith('}')) {
          try {
            query[key] = JSON.parse(value);
          } catch {
            query[key] = value;
          }
        } 
        // Regular parameters
        else {
          query[key] = value;
        }
      });
      
      return { params, query };
    } catch (error) {
      console.error('Error parsing deep link:', error);
      
      showNavigationErrorToast({
        type: NavigationErrorType.VALIDATION_ERROR,
        path,
        message: error instanceof Error ? error.message : 'Error parsing deep link',
        role
      });
      
      return null;
    }
  }, [role]);
  
  return {
    createDeepLink,
    navigateToDeepLink,
    parseDeepLink
  };
};
