
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
   * @returns Boolean indicating if navigation was successful
   */
  const navigateToDeepLink = useCallback((
    path: string,
    params: Record<string, string> = {},
    query: Record<string, string> = {}
  ): boolean => {
    const deepLink = createDeepLink(path, params, query);
    return navigateTo(deepLink);
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
  
  /**
   * Generate a shareable deep link URL (absolute URL)
   * @param path Base path
   * @param params Route parameters
   * @param query Query parameters
   * @returns Absolute URL for sharing
   */
  const getShareableLink = useCallback((
    path: string,
    params: Record<string, string> = {},
    query: Record<string, string> = {}
  ): string => {
    const deepLink = createDeepLink(path, params, query);
    
    // Generate absolute URL
    if (typeof window !== 'undefined') {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      return `${baseUrl}${deepLink.startsWith('/') ? '' : '/'}${deepLink}`;
    }
    
    return deepLink;
  }, []);
  
  /**
   * Copy a shareable deep link to clipboard
   * @param path Base path
   * @param params Route parameters
   * @param query Query parameters
   * @returns Promise resolving to boolean indicating success
   */
  const copyShareableLink = useCallback(async (
    path: string,
    params: Record<string, string> = {},
    query: Record<string, string> = {}
  ): Promise<boolean> => {
    const link = getShareableLink(path, params, query);
    
    try {
      await navigator.clipboard.writeText(link);
      return true;
    } catch (error) {
      console.error('Failed to copy link:', error);
      return false;
    }
  }, [getShareableLink]);
  
  return {
    createLink,
    navigateToDeepLink,
    getCurrentQueryParams,
    updateQueryParams,
    getShareableLink,
    copyShareableLink
  };
};
