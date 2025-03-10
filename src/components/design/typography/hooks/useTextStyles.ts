
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { useTextStyleStore } from "@/stores/textStyles/textStyleState";
import { useToast } from "@/hooks/use-toast";

export const useTextStyles = () => {
  const [styles, setStyles] = useState<TextStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const getTextStyles = useTextStyleStore(state => state.getTextStyles);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        setIsLoading(true);
        const fetchedStyles = await getTextStyles();
        setStyles(fetchedStyles);
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
  }, [getTextStyles, toast]);

  return {
    styles,
    isLoading
  };
};
