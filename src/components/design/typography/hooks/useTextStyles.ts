
// Re-export the shared hook with default options
import { useTextStyles as useSharedTextStyles } from "@/hooks/useTextStyles";

export const useTextStyles = () => {
  // Design version doesn't need the operations by default
  return useSharedTextStyles({ withOperations: false });
};
