
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/utils/error/handleError';
import { useRoleAwareErrorHandling } from '@/hooks/useErrorHandling';

interface FetchOptions {
  context: string;
  errorMessage?: string;
  onSuccess?: (data: any) => void;
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
}

export function useDataFetch<T>(
  queryKey: string | string[],
  fetchFn: () => Promise<T>,
  options: FetchOptions = { context: 'generic-fetch' }
) {
  const { handleRoleAwareError } = useRoleAwareErrorHandling();
  const { toast } = useToast();
  
  const queryKeyArray = Array.isArray(queryKey) ? queryKey : [queryKey];
  
  return useQuery({
    queryKey: queryKeyArray,
    queryFn: async () => {
      try {
        return await fetchFn();
      } catch (error) {
        handleRoleAwareError(error, options.context, options.errorMessage);
        throw error;
      }
    },
    staleTime: options.staleTime || 5 * 60 * 1000, // 5 minutes default
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    enabled: options.enabled ?? true,
  });
}

export function useDataMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options: {
    context: string;
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (data: T) => void;
    queryKey?: string | string[];
  }
) {
  const { handleRoleAwareError } = useRoleAwareErrorHandling();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const queryKeyArray = options.queryKey 
    ? (Array.isArray(options.queryKey) ? options.queryKey : [options.queryKey])
    : null;
  
  return useMutation({
    mutationFn: async (variables: V) => {
      try {
        return await mutationFn(variables);
      } catch (error) {
        handleRoleAwareError(error, options.context, options.errorMessage);
        throw error;
      }
    },
    onSuccess: (data) => {
      if (options.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
        });
      }
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
      
      // Invalidate query cache if a queryKey is provided
      if (queryKeyArray) {
        queryClient.invalidateQueries({ queryKey: queryKeyArray });
      }
    }
  });
}

// Specialized hook for paginated data
export function usePaginatedDataFetch<T>(
  baseQueryKey: string | string[],
  fetchFn: (page: number, pageSize: number) => Promise<{ data: T[], totalCount: number }>,
  options: FetchOptions & {
    page: number;
    pageSize: number;
  }
) {
  const queryKeyBase = Array.isArray(baseQueryKey) ? baseQueryKey : [baseQueryKey];
  const queryKey = [...queryKeyBase, options.page, options.pageSize];
  
  return useDataFetch(
    queryKey,
    () => fetchFn(options.page, options.pageSize),
    options
  );
}
