
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { handleError } from '@/utils/error/handleError';

type EventCategory = 
  | 'document' 
  | 'project' 
  | 'template' 
  | 'search' 
  | 'navigation' 
  | 'user' 
  | 'error';

type EventAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'view' 
  | 'search' 
  | 'click' 
  | 'error';

interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

export function useAnalytics() {
  const { user, role } = useAuth();
  
  const trackEvent = useCallback((
    category: EventCategory,
    action: EventAction,
    label?: string,
    properties?: EventProperties
  ) => {
    try {
      // In a production app, this would send the event to an analytics service
      // For now, we'll just log it to console
      console.info(`[Analytics] ${category}.${action}${label ? `: ${label}` : ''}`);
      
      // Create analytics payload with user information
      const analyticsPayload = {
        category,
        action,
        label,
        userRole: role,
        userId: user?.id,
        timestamp: new Date().toISOString(),
        ...properties,
      };
      
      console.debug('[Analytics] Payload:', analyticsPayload);
      
      // Here you would send the data to your analytics platform
      // Example: await analyticsService.trackEvent(analyticsPayload);
      
    } catch (error) {
      // Don't let analytics errors impact the user experience
      // Just log them quietly
      handleError(error, 'useAnalytics.trackEvent', undefined, false);
    }
  }, [user, role]);
  
  const trackPageView = useCallback((
    pageName: string,
    properties?: EventProperties
  ) => {
    trackEvent('navigation', 'view', pageName, properties);
  }, [trackEvent]);
  
  const trackSearch = useCallback((
    searchQuery: string,
    resultCount: number,
    filters?: Record<string, any>
  ) => {
    trackEvent('search', 'search', searchQuery, {
      resultCount,
      ...filters,
    });
  }, [trackEvent]);
  
  const trackDocumentAction = useCallback((
    action: EventAction,
    documentId: string,
    documentTitle?: string,
    properties?: EventProperties
  ) => {
    trackEvent('document', action, documentTitle || documentId, {
      documentId,
      ...properties,
    });
  }, [trackEvent]);
  
  return {
    trackEvent,
    trackPageView,
    trackSearch,
    trackDocumentAction
  };
}
