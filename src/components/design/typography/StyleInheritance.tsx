
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
      const fetchedStyles = await textStyleStore.getTextStyles();
      // Filter out the current style to prevent circular inheritance
      setStyles(fetchedStyles.filter(style => style.id !== currentStyleId));
    };

    fetchStyles();
  }, [currentStyleId]);

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
