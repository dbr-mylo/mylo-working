
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";

interface StyleInheritanceProps {
  currentStyleId: string;
  parentId?: string;
  onParentChange: (parentId: string | undefined) => void;
}

export const StyleInheritance = ({ 
  currentStyleId, 
  parentId, 
  onParentChange 
}: StyleInheritanceProps) => {
  const [availableParents, setAvailableParents] = useState<TextStyle[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch all styles that could be valid parents
  useEffect(() => {
    const fetchAvailableParents = async () => {
      try {
        setLoading(true);
        const allStyles = await textStyleStore.getTextStyles();
        
        // Filter out:
        // 1. The current style itself
        // 2. Any styles that have this style as an ancestor (would create circular ref)
        const validParents = allStyles.filter(style => {
          // Don't include the current style
          if (style.id === currentStyleId) return false;
          
          // Don't include styles that would create circular references
          if (currentStyleId) {
            // Check if adding this style as a parent would create a circular reference
            const wouldCreateCircular = checkCircularReference(style.id, currentStyleId);
            if (wouldCreateCircular) return false;
          }
          
          return true;
        });
        
        setAvailableParents(validParents);
      } catch (error) {
        console.error("Error fetching available parents:", error);
        setAvailableParents([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Function to check if adding a parent would create a circular reference
    const checkCircularReference = async (parentId: string, childId: string): Promise<boolean> => {
      try {
        // Get the inheritance chain of the potential parent
        const chain = await textStyleStore.getInheritanceChain(parentId);
        
        // If the child is in the parent's chain, it would create a circular reference
        return chain.some(style => style.id === childId);
      } catch (error) {
        console.error("Error checking circular reference:", error);
        return true; // Safer to assume it would create a circular reference
      }
    };
    
    fetchAvailableParents();
  }, [currentStyleId]);

  const handleParentChange = (value: string) => {
    onParentChange(value === "" ? undefined : value);
  };
  
  if (loading) {
    return <div className="text-xs text-muted-foreground">Loading available parents...</div>;
  }

  return (
    <Select
      value={parentId || ""}
      onValueChange={handleParentChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="No parent style (base style)" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">No parent style (base style)</SelectItem>
        {availableParents.map(style => (
          <SelectItem key={style.id} value={style.id}>
            {style.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
