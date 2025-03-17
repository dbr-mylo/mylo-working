
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";

interface StyleInheritanceProps {
  parentId?: string;
  onParentChange: (parentId: string | undefined) => void;
  currentStyleId?: string;
  compact?: boolean;
}

export const StyleInheritance = ({ 
  parentId, 
  onParentChange, 
  currentStyleId,
  compact = false
}: StyleInheritanceProps) => {
  const [availableParents, setAvailableParents] = useState<TextStyle[]>([]);
  const [parentStyle, setParentStyle] = useState<TextStyle | null>(null);
  const [inheritanceChain, setInheritanceChain] = useState<TextStyle[]>([]);
  
  // Load available parents
  useEffect(() => {
    const loadStyles = async () => {
      try {
        const styles = await textStyleStore.getTextStyles();
        
        // Filter out current style and any styles that would create circular inheritance
        const filtered = styles.filter(style => {
          if (!currentStyleId) return true;
          if (style.id === currentStyleId) return false;
          
          // Check if selecting this style as parent would create circular inheritance
          return !wouldCreateCircularDependency(style.id, currentStyleId, styles);
        });
        
        setAvailableParents(filtered);
      } catch (error) {
        console.error("Error loading available parent styles:", error);
      }
    };
    
    loadStyles();
  }, [currentStyleId]);

  // Helper function to check for circular dependencies
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
  
  // Load parent style details when parentId changes
  useEffect(() => {
    if (!parentId) {
      setParentStyle(null);
      setInheritanceChain([]);
      return;
    }
    
    const loadParentStyle = async () => {
      try {
        const style = await textStyleStore.getStyleWithInheritance(parentId);
        setParentStyle(style);
        
        const chain = await textStyleStore.getInheritanceChain(parentId);
        setInheritanceChain(chain);
      } catch (error) {
        console.error("Error loading parent style:", error);
        setParentStyle(null);
        setInheritanceChain([]);
      }
    };
    
    loadParentStyle();
  }, [parentId]);

  const handleParentChange = (value: string) => {
    if (value === "none") {
      onParentChange(undefined);
    } else {
      onParentChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <Label className={`${compact ? "text-xs" : ""} mb-0.5 inline-block`}>
          Inherit From Style
        </Label>
        <Select
          value={parentId || "none"}
          onValueChange={handleParentChange}
        >
          <SelectTrigger className={compact ? "h-7 text-xs" : ""}>
            <SelectValue placeholder="Select parent style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Parent</SelectItem>
            {availableParents.map(style => (
              <SelectItem key={style.id} value={style.id}>
                {style.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {parentStyle && (
        <div className="mt-2">
          <Label className={`${compact ? "text-xs" : ""} mb-0.5 inline-block`}>
            Inheritance Chain
          </Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {inheritanceChain.map((style, index) => (
              <React.Fragment key={style.id}>
                {index > 0 && (
                  <span className="text-muted-foreground">→</span>
                )}
                <Badge 
                  variant="outline" 
                  className={`${compact ? "text-xs py-0" : ""} bg-primary/10 border-primary/20`}
                >
                  {style.name}
                </Badge>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
