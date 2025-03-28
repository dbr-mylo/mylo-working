
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook to manage text styles with extended functionality based on user role
 * Consolidates functionality from both design and designer versions
 */
export const useTextStyles = (options?: { withOperations?: boolean }) => {
  const [styles, setStyles] = useState<TextStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const includeOperations = options?.withOperations ?? true;

  useEffect(() => {
    let isMounted = true;
    
    const fetchStyles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedStyles = await textStyleStore.getTextStyles();
        
        if (isMounted) {
          setStyles(fetchedStyles);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error loading text styles:", error);
          setError(error instanceof Error ? error : new Error("Failed to load styles"));
          toast({
            title: "Error loading styles",
            description: "Could not load text styles",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStyles();
    
    return () => {
      isMounted = false;
    };
  }, [toast]);

  // Only include operations if requested (primarily for designer role)
  const operations = includeOperations ? {
    refreshStyles: async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const textStyles = await textStyleStore.getTextStyles();
        setStyles(textStyles);
      } catch (err) {
        console.error("Error refreshing text styles:", err);
        setError(err instanceof Error ? err : new Error("Failed to refresh styles"));
        toast({
          title: "Error refreshing styles",
          description: "Failed to refresh text styles",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    
    saveStyle: async (style: TextStyle) => {
      try {
        const savedStyle = await textStyleStore.saveTextStyle(style);
        await operations.refreshStyles();
        toast({
          title: "Style saved",
          description: `"${style.name}" style has been saved`,
        });
        return savedStyle;
      } catch (err) {
        console.error("Error saving text style:", err);
        toast({
          title: "Error saving style",
          description: "Failed to save text style",
          variant: "destructive",
        });
        throw err;
      }
    },
    
    deleteStyle: async (styleId: string) => {
      try {
        await textStyleStore.deleteTextStyle(styleId);
        await operations.refreshStyles();
        toast({
          title: "Style deleted",
          description: "Text style has been removed",
        });
      } catch (err) {
        console.error("Error deleting text style:", err);
        toast({
          title: "Error deleting style",
          description: err instanceof Error ? err.message : "Failed to delete text style",
          variant: "destructive",
        });
        throw err;
      }
    }
  } : undefined;

  return {
    styles,
    isLoading,
    error,
    ...(operations || {})
  };
};
