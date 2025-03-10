
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";

export const useTextStyles = () => {
  const [styles, setStyles] = useState<TextStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        setIsLoading(true);
        const fetchedStyles = await textStyleStore.getTextStyles();
        
        // Sort styles to ensure the default style appears first
        const sortedStyles = [...fetchedStyles].sort((a, b) => {
          // Default style first
          if (a.isDefault) return -1;
          if (b.isDefault) return 1;
          
          // Then system styles
          if (a.isSystem && !b.isSystem) return -1;
          if (!a.isSystem && b.isSystem) return 1;
          
          // Then alphabetically
          return a.name.localeCompare(b.name);
        });
        
        setStyles(sortedStyles);
      } catch (error) {
        console.error("Error loading text styles:", error);
        toast({
          title: "Error loading styles",
          description: "Could not load text styles",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStyles();
  }, [toast]);

  return {
    styles,
    isLoading
  };
};
