
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createComplexDeepLink, parseComplexParameters } from '@/components/toolbar/testing/parameters/utils/complexParameterUtils';
import { useNavigationHandlers } from '@/hooks/navigation';

/**
 * Hook for creating and navigating to deep links with advanced parameter support
 */
export const useAdvancedDeepLinking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { navigateTo } = useNavigationHandlers();
  
  /**
   * Create a deep link URL with support for complex parameters
   * @param path Base path
   * @param params Route parameters
   * @param query Query parameters including complex types
   * @returns Deep link URL
   */
  const createLink = useCallback((
    path: string,
    params: Record<string, any> = {},
    query: Record<string, any> = {}
  ): string => {
    return createComplexDeepLink(path, params, query);
  }, []);
  
  /**
   * Navigate to a deep link with complex parameters
   * @param path Base path
   * @param params Route parameters
   * @param query Query parameters including complex types
   * @returns Boolean indicating if navigation was successful
   */
  const navigateToDeepLink = useCallback((
    path: string,
    params: Record<string, any> = {},
    query: Record<string, any> = {}
  ): boolean => {
    try {
      const deepLink = createComplexDeepLink(path, params, query);
      return navigateTo(deepLink);
    } catch (error) {
      console.error('Failed to navigate to deep link:', error);
      toast({
        title: 'Navigation error',
        description: 'Could not navigate to the specified location',
        variant: 'destructive',
      });
      return false;
    }
  }, [navigateTo, toast]);
  
  /**
   * Get current URL complex parameters
   * @returns Object with current query parameters
   */
  const getCurrentParameters = useCallback((): {
    pathParams: Record<string, any>;
    queryParams: Record<string, any>;
  } => {
    const { pathname, search } = window.location;
    const result = parseComplexParameters(pathname + search);
    return {
      pathParams: result.pathParams,
      queryParams: result.queryParams
    };
  }, []);
  
  /**
   * Update complex query parameters without changing the current path
   * @param query Query parameters to update
   * @param replace Whether to replace or merge with existing parameters
   */
  const updateComplexQueryParams = useCallback((
    query: Record<string, any>,
    replace: boolean = false
  ): void => {
    try {
      const { pathname } = window.location;
      const { queryParams: currentParams } = getCurrentParameters();
      const newParams = replace ? query : { ...currentParams, ...query };
      
      // Filter out empty values
      const filteredParams = Object.fromEntries(
        Object.entries(newParams).filter(([_, v]) => {
          if (v === null || v === undefined) return false;
          if (Array.isArray(v) && v.length === 0) return false;
          return true;
        })
      );
      
      // Create new URL with the updated parameters
      const deepLink = createComplexDeepLink(pathname, {}, filteredParams);
      const newUrl = deepLink.substring(pathname.length); // Just get the query string part
      
      navigate(`${pathname}${newUrl}`, { replace: true });
    } catch (error) {
      console.error('Failed to update query parameters:', error);
      toast({
        title: 'Error updating parameters',
        description: 'Could not update the URL parameters',
        variant: 'destructive',
      });
    }
  }, [navigate, getCurrentParameters, toast]);
  
  /**
   * Parse a deep link URL to extract its parameters
   * @param url URL to parse
   * @returns Extracted parameters
   */
  const parseDeepLink = useCallback((url: string): {
    path: string;
    pathParams: Record<string, any>;
    queryParams: Record<string, any>;
  } => {
    return parseComplexParameters(url);
  }, []);
  
  return {
    createLink,
    navigateToDeepLink,
    getCurrentParameters,
    updateComplexQueryParams,
    parseDeepLink
  };
};
