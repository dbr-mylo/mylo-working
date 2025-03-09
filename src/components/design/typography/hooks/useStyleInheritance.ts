
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";

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
        
        const filteredStyles = filterValidParentStyles(fetchedStyles, currentStyleId);
        setStyles(filteredStyles);
        
        if (parentId) {
          const chain = await fetchInheritanceChain(parentId, fetchedStyles);
          setInheritanceChain(chain);
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

  const fetchInheritanceChain = async (styleId: string, allStyles: TextStyle[]): Promise<TextStyle[]> => {
    const chain: TextStyle[] = [];
    let currentId = styleId;
    
    const visitedIds = new Set<string>();
    
    while (currentId && !visitedIds.has(currentId)) {
      visitedIds.add(currentId);
      
      const style = allStyles.find(s => s.id === currentId);
      if (!style) break;
      
      chain.push(style);
      currentId = style.parentId || '';
    }
    
    return chain;
  };

  const filterValidParentStyles = (allStyles: TextStyle[], styleId?: string): TextStyle[] => {
    if (!styleId) return allStyles;
    
    return allStyles.filter(style => 
      style.id !== styleId && 
      !wouldCreateCircularDependency(style.id, styleId, allStyles)
    );
  };

  const wouldCreateCircularDependency = (
    potentialParentId: string,
    childStyleId: string,
    allStyles: TextStyle[],
    visited: Set<string> = new Set()
  ): boolean => {
    if (visited.has(potentialParentId)) {
      return true;
    }
    
    visited.add(potentialParentId);
    
    const style = allStyles.find(s => s.id === potentialParentId);
    
    if (!style || !style.parentId) {
      return false;
    }
    
    if (style.parentId === childStyleId) {
      return true;
    }
    
    return wouldCreateCircularDependency(style.parentId, childStyleId, allStyles, visited);
  };

  return {
    styles,
    loading,
    error,
    inheritanceChain
  };
};
