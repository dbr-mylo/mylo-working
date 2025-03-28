
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";

export const useTextStyles = () => {
  const [styles, setStyles] = useState<TextStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedStyles = await textStyleStore.getTextStyles();
        setStyles(fetchedStyles);
      } catch (error) {
        console.error("Error loading text styles:", error);
        setError(error instanceof Error ? error : new Error("Failed to load styles"));
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
    isLoading,
    error
  };
};
