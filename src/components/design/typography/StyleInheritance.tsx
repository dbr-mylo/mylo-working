
import React, { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface StyleInheritanceProps {
  currentStyleId?: string;
  parentId?: string;
  onChange: (parentId: string | undefined) => void;
  disabled?: boolean;
}

export const StyleInheritance = ({ 
  currentStyleId, 
  parentId, 
  onChange, 
  disabled = false 
}: StyleInheritanceProps) => {
  const [styles, setStyles] = useState<TextStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    const fetchStyles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const fetchedStyles = await textStyleStore.getTextStyles();
        
        if (!isMounted) return;
        
        // Filter out styles that would create circular dependencies
        const filteredStyles = filterValidParentStyles(fetchedStyles, currentStyleId);
        setStyles(filteredStyles);
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
  }, [currentStyleId, toast]);

  // Function to filter out styles that would create circular dependencies
  const filterValidParentStyles = (allStyles: TextStyle[], styleId?: string): TextStyle[] => {
    if (!styleId) return allStyles;
    
    return allStyles.filter(style => 
      // Cannot inherit from itself
      style.id !== styleId && 
      // Cannot inherit from any style that would create a circular dependency
      !wouldCreateCircularDependency(style.id, styleId, allStyles)
    );
  };

  // Enhanced function to check if selecting a style as parent would create a circular dependency
  const wouldCreateCircularDependency = (
    potentialParentId: string,
    childStyleId: string,
    allStyles: TextStyle[],
    visited: Set<string> = new Set()
  ): boolean => {
    // If we've already visited this style in our traversal, we have a cycle
    if (visited.has(potentialParentId)) {
      return true;
    }
    
    // Add the current style to our visited set
    visited.add(potentialParentId);
    
    const style = allStyles.find(s => s.id === potentialParentId);
    
    // If style doesn't exist or has no parent, it can't form a cycle
    if (!style || !style.parentId) {
      return false;
    }
    
    // If this style's parent is the child we're checking, we have a cycle
    if (style.parentId === childStyleId) {
      return true;
    }
    
    // Recursively check this style's parent
    return wouldCreateCircularDependency(style.parentId, childStyleId, allStyles, visited);
  };

  const handleSelectChange = (value: string) => {
    if (value === parentId) return; // No change
    
    try {
      // Additional validation if needed before applying the change
      if (value !== "none" && styles.findIndex(s => s.id === value) === -1) {
        throw new Error("Selected style is not valid as a parent");
      }
      
      onChange(value === "none" ? undefined : value);
    } catch (err) {
      console.error("Error changing parent style:", err);
      toast({
        title: "Error changing parent style",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="parent-style">Inherit From</Label>
      <Select
        disabled={disabled || loading}
        value={parentId || "none"}
        onValueChange={handleSelectChange}
      >
        <SelectTrigger id="parent-style" className={error ? "border-destructive" : ""}>
          <SelectValue placeholder={loading ? "Loading styles..." : "Select parent style"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None (Base Style)</SelectItem>
          {styles.map((style) => (
            <SelectItem key={style.id} value={style.id}>
              {style.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Inheriting from another style will use its properties as a base for this style.
        </p>
      )}
    </div>
  );
};
