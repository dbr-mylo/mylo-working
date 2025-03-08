
import React, { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const fetchedStyles = await textStyleStore.getTextStyles();
        // Filter out the current style and any styles that have this style as their parent
        // to prevent circular inheritance
        const filteredStyles = fetchedStyles.filter(style => 
          style.id !== currentStyleId && 
          // Also filter out styles that would create circular dependencies
          !hasCircularDependency(style.id, currentStyleId, fetchedStyles)
        );
        setStyles(filteredStyles);
      } catch (error) {
        console.error('Error fetching styles for inheritance:', error);
        setStyles([]);
      }
    };

    fetchStyles();
  }, [currentStyleId]);

  // Function to check if selecting a style as parent would create a circular dependency
  const hasCircularDependency = (
    styleId: string,
    potentialChildId: string | undefined,
    allStyles: TextStyle[]
  ): boolean => {
    if (!potentialChildId || styleId === potentialChildId) return false;
    
    const style = allStyles.find(s => s.id === styleId);
    if (!style || !style.parentId) return false;
    
    if (style.parentId === potentialChildId) return true;
    
    return hasCircularDependency(style.parentId, potentialChildId, allStyles);
  };

  const handleSelectChange = (value: string) => {
    onChange(value === "none" ? undefined : value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="parent-style">Inherit From</Label>
      <Select
        disabled={disabled}
        value={parentId || "none"}
        onValueChange={handleSelectChange}
      >
        <SelectTrigger id="parent-style">
          <SelectValue placeholder="Select parent style" />
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
      <p className="text-xs text-muted-foreground">
        Inheriting from another style will use its properties as a base for this style.
      </p>
    </div>
  );
};
