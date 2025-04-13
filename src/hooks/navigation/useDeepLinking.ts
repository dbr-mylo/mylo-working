
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDeepLink, parseQueryParams } from '@/utils/navigation/routeUtils';
import { useNavigationHandlers } from './useNavigationHandlers';

/**
 * Hook for creating and navigating to deep links
 */
export const useDeepLinking = () => {
  const navigate = useNavigate();
  const { navigateTo } = useNavigationHandlers();
  
  /**
   * Create a deep link URL
   * @param path Base path
   * @param params Route parameters
   * @param query Query parameters
   * @returns Deep link URL
   */
  const createLink = useCallback((
    path: string,
    params: Record<string, string> = {},
    query: Record<string, string> = {}
  ): string => {
    return createDeepLink(path, params, query);
  }, []);
  
  /**
   * Navigate to a deep link
   * @param path Base path
   * @param params Route parameters
   * @param query Query parameters
   */
  const navigateToDeepLink = useCallback((
    path: string,
    params: Record<string, string> = {},
    query: Record<string, string> = {}
  ): void => {
    const deepLink = createDeepLink(path, params, query);
    navigateTo(deepLink);
  }, [navigateTo]);
  
  /**
   * Get current URL query parameters
   * @returns Object with current query parameters
   */
  const getCurrentQueryParams = useCallback((): Record<string, string> => {
    return parseQueryParams(window.location.search);
  }, []);
  
  /**
   * Update query parameters without changing the current path
   * @param query Query parameters to update
   * @param replace Whether to replace or merge with existing parameters
   */
  const updateQueryParams = useCallback((
    query: Record<string, string>,
    replace: boolean = false
  ): void => {
    const currentParams = replace ? {} : getCurrentQueryParams();
    const newParams = { ...currentParams, ...query };
    
    // Filter out empty values
    const filteredParams = Object.fromEntries(
      Object.entries(newParams).filter(([_, v]) => v !== '')
    );
    
    const queryString = new URLSearchParams(filteredParams).toString();
    navigate(`${window.location.pathname}${queryString ? `?${queryString}` : ''}`, { replace: true });
  }, [navigate, getCurrentQueryParams]);
  
  return {
    createLink,
    navigateToDeepLink,
    getCurrentQueryParams,
    updateQueryParams
  };
};
