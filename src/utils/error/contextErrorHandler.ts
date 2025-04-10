
import { toast } from "sonner";

/**
 * Error types specifically for context-related errors
 */
export enum ContextErrorType {
  MISSING_PROVIDER = 'missing_provider',
  INVALID_CONTEXT = 'invalid_context',
  CONTEXT_INITIALIZATION = 'context_initialization'
}

/**
 * Handles errors related to React context
 * This is specifically useful for missing providers or context initialization issues
 * 
 * @param error The error that occurred
 * @param componentName The component where the error occurred
 * @param contextName The name of the context that caused the error
 * @returns Boolean indicating if the error was handled
 */
export const handleContextError = (
  error: unknown, 
  componentName: string, 
  contextName: string
): boolean => {
  // Check if this is a context provider error
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (errorMessage.includes('must be used within a') || 
      errorMessage.includes('Provider') || 
      errorMessage.includes('Context')) {
    
    console.error(`Context error in ${componentName}: Missing ${contextName} provider`, error);
    
    toast.error(`Component error: ${componentName}`, {
      description: `Missing required provider: ${contextName}. Try refreshing the page.`,
      duration: 5000,
    });
    
    // Log detailed information for debugging
    console.info(`[DEBUG] Context tree issue detected:
      - Component: ${componentName}
      - Required context: ${contextName}
      - Error: ${errorMessage}
      - This usually means the component is being rendered outside its required provider.
    `);
    
    return true;
  }
  
  return false;
};

/**
 * Creates a safe wrapper for using context hooks
 * 
 * @param useHook The context hook to wrap
 * @param defaultValue A default value to return if the hook fails
 * @param contextName The name of the context for error reporting
 * @returns The result of the hook or the default value if it fails
 */
export function createSafeContextHook<T, D = undefined>(
  useHook: () => T, 
  defaultValue: D, 
  contextName: string
): () => T | D {
  return () => {
    try {
      return useHook();
    } catch (error) {
      handleContextError(error, 'SafeContextHook', contextName);
      return defaultValue;
    }
  };
}
