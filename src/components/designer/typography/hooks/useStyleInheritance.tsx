
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";

interface UseStyleInheritanceProps {
  currentStyleId?: string;
  parentId?: string;
}

export const useStyleInheritance = ({ 
  currentStyleId, 
  parentId 
}: UseStyleInheritanceProps) => {
  const [styles, setStyles] = useState<TextStyle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inheritanceChain, setInheritanceChain] = useState<TextStyle[]>([]);
  
  // Load available styles
  useEffect(() => {
    const loadStyles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let textStyles = await textStyleStore.getTextStyles();
        
        // Filter out the current style to prevent circular references
        if (currentStyleId) {
          textStyles = textStyles.filter(style => style.id !== currentStyleId);
        }
        
        setStyles(textStyles);
      } catch (err) {
        console.error("Error loading text styles for inheritance:", err);
        setError("Failed to load available styles");
      } finally {
        setLoading(false);
      }
    };
    
    loadStyles();
  }, [currentStyleId]);
  
  // Calculate inheritance chain when parentId changes
  useEffect(() => {
    const calculateInheritanceChain = async () => {
      if (!parentId) {
        setInheritanceChain([]);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Get the inheritance chain
        const chain = await textStyleStore.getInheritanceChain(parentId);
        
        // Check for circular references
        if (chain.some(style => style.id === currentStyleId)) {
          setError("Circular reference detected in style inheritance");
          // Clear parent if there's a circular reference
          setInheritanceChain([]);
          return;
        }
        
        setInheritanceChain(chain);
      } catch (err) {
        console.error("Error calculating inheritance chain:", err);
        setError("Failed to determine style inheritance chain");
        setInheritanceChain([]);
      } finally {
        setLoading(false);
      }
    };
    
    calculateInheritanceChain();
  }, [parentId, currentStyleId]);
  
  return { styles, loading, error, inheritanceChain };
};
