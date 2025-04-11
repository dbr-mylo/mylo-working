import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { toast } from "sonner";
import { handleError } from "@/utils/error/handleError";
import { useRoleAwareErrorHandling } from '@/hooks/useErrorHandling';
import { useAuth } from "@/contexts/AuthContext";
import { classifyError, ErrorCategory } from '@/utils/error/errorClassifier';

// Configure default stale times for different data types
const DEFAULT_STALE_TIMES = {
  documents: 5 * 60 * 1000, // 5 minutes
  projects: 10 * 60 * 1000, // 10 minutes
  settings: 30 * 60 * 1000, // 30 minutes
  user: 15 * 60 * 1000, // 15 minutes
};

export interface FetchOptions<TData> {
  // Context string for error tracking
  context: string;
  // Optional message to show on error
  errorMessage?: string;
  // Optional callback on successful fetch
  onSuccess?: (data: TData) => void;
  // Optional callback on error
  onError?: (error: unknown) => void;
  // Whether query is enabled
  enabled?: boolean;
  // How long data should be considered fresh (in ms)
  staleTime?: number;
  // Whether to refetch when window regains focus
  refetchOnWindowFocus?: boolean;
  // Whether to refetch when reconnecting
  refetchOnReconnect?: boolean;
  // How many times to retry failed queries
  retry?: number | boolean;
  // Whether to show toast on error
  showErrorToast?: boolean;
  // Retry delay (in ms) - can be a function that takes retry attempt
  retryDelay?: number | ((retryAttempt: number) => number);
}

/**
 * Enhanced data fetching hook that standardizes error handling,
 * logging, and user feedback
 */
export function useStandardQuery<TData>(
  queryKey: QueryKey,
  fetchFn: () => Promise<TData>,
  options: FetchOptions<TData>
) {
  const { role } = useAuth();
  const { handleRoleAwareError } = useRoleAwareErrorHandling();
  
  // Extract data type from the queryKey for default stale time
  const dataType = Array.isArray(queryKey) && typeof queryKey[0] === 'string' 
    ? queryKey[0] 
    : 'default';
    
  // Default stale time based on data type or fallback to 5 minutes
  const defaultStaleTime = DEFAULT_STALE_TIMES[dataType as keyof typeof DEFAULT_STALE_TIMES] || 5 * 60 * 1000;
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await fetchFn();
      } catch (error) {
        // Enhanced error handling with role-specific messages
        handleRoleAwareError(error, options.context, options.errorMessage);
        
        // Classify the error to determine if it's a network issue
        const classifiedError = classifyError(error, options.context);
        
        // Log additional debug information
        console.debug(`[QueryError] ${options.context}:`, { 
          error, 
          category: classifiedError.category,
          queryKey 
        });
        
        throw error;
      }
    },
    staleTime: options.staleTime ?? defaultStaleTime,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    refetchOnReconnect: options.refetchOnReconnect ?? true,
    retry: options.retry ?? ((_, error) => {
      // Only retry network errors by default
      const classifiedError = classifyError(error, options.context);
      return classifiedError.category === ErrorCategory.NETWORK;
    }),
    retryDelay: options.retryDelay ?? defaultRetryDelay,
    enabled: options.enabled ?? true,
    meta: {
      context: options.context,
    },
  });
}

/**
 * Exponential backoff for retries
 */
function defaultRetryDelay(attemptIndex: number) {
  return Math.min(1000 * 2 ** attemptIndex, 30000);
}

/**
 * Standardized mutation hook with enhanced error handling
 */
export function useStandardMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    context: string;
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (data: TData) => void;
    invalidateQueries?: QueryKey[];
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
  }
) {
  const { handleRoleAwareError } = useRoleAwareErrorHandling();
  const queryClient = useQueryClient();
  const { role } = useAuth();
  
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      try {
        return await mutationFn(variables);
      } catch (error) {
        // Enhanced error handling with context and role information
        handleRoleAwareError(error, options.context, options.errorMessage);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Show success toast if enabled
      if (options.showSuccessToast !== false && options.successMessage) {
        toast.success(options.successMessage);
      }
      
      // Call custom success handler if provided
      if (options.onSuccess) {
        options.onSuccess(data);
      }
      
      // Invalidate queries to refresh data
      if (options.invalidateQueries && options.invalidateQueries.length > 0) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
    },
    onError: (error) => {
      // Error is already handled in mutationFn, but additional logic can be added here
      console.debug(`[MutationError] ${options.context}:`, error);
    }
  });
}

/**
 * Specialized hook for paginated data fetching
 */
export function usePaginatedQuery<TData extends { data: any[], totalCount: number }>(
  baseQueryKey: QueryKey,
  fetchFn: (page: number, pageSize: number) => Promise<TData>,
  options: FetchOptions<TData> & {
    page: number;
    pageSize: number;
  }
) {
  const queryKey = [...baseQueryKey, options.page, options.pageSize];
  
  return useStandardQuery(
    queryKey,
    () => fetchFn(options.page, options.pageSize),
    options
  );
}

/**
 * Hook for infinite scrolling data fetching
 */
export function useInfiniteQuery<TData>(
  queryKey: QueryKey,
  fetchFn: (page: number) => Promise<TData[]>,
  options: FetchOptions<TData[]> & {
    initialPage?: number;
    getNextPageParam?: (lastPage: TData[], allPages: TData[][]) => number | undefined;
  }
) {
  // Implementation for infinite query will be added later
  // This is a placeholder for now
  return useStandardQuery(queryKey, () => fetchFn(options.initialPage || 0), options);
}
