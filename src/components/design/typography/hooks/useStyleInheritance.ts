
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";
import { filterValidParentStyles, wouldCreateCircularDependency } from "@/utils/roles/StyleInheritanceUtils";

interface UseStyleInheritanceProps {
  currentStyleId?: string;
  parentId?: string;
}

export const useStyleInheritance = ({ currentStyleId, parentId }: UseStyleInheritanceProps) => {
  const [styles, setStyles] = useState<TextStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inheritanceChain, setInheritanceChain] = useState<TextStyle[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    const fetchStyles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const fetchedStyles = await textStyleStore.getTextStyles();
        
        if (!isMounted) return;
        
        // Use our utility function to filter out invalid parent styles
        const filteredStyles = filterValidParentStyles(fetchedStyles, currentStyleId);
        setStyles(filteredStyles);
        
        if (parentId) {
          // Fetch the inheritance chain
          try {
            const chain = await textStyleStore.getInheritanceChain(parentId);
            
            // Check for circular dependencies
            if (chain.some(s => s.id === currentStyleId)) {
              setError("Circular reference detected in style inheritance");
              setInheritanceChain([]);
            } else {
              setInheritanceChain(chain);
            }
          } catch (err) {
            console.error("Error fetching inheritance chain:", err);
            setError("Failed to load inheritance chain");
            setInheritanceChain([]);
          }
        } else {
          setInheritanceChain([]);
        }
      } catch (err) {
        if (!isMounted) return;
        
        console.error('Error fetching styles for inheritance:', err);
        setError('Failed to load available styles');
        toast({
          title: "Error loading styles",
          description: "Could not load available parent styles",
          variant: "destructive",
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStyles();
    
    return () => {
      isMounted = false;
    };
  }, [currentStyleId, parentId, toast]);

  return {
    styles,
    loading,
    error,
    inheritanceChain
  };
};
