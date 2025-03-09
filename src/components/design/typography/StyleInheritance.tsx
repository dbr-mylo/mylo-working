import React, { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Link, Link2Off, AlertCircle } from "lucide-react";

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
  const [inheritanceChain, setInheritanceChain] = useState<TextStyle[]>([]);

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

  const handleSelectChange = (value: string) => {
    if (value === parentId) return;
    
    try {
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
          <SelectItem value="none" className="flex items-center">
            <Link2Off className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
            <span>None (Base Style)</span>
          </SelectItem>
          {styles.map((style) => (
            <SelectItem key={style.id} value={style.id} className="flex items-center">
              <Link className="h-3.5 w-3.5 mr-2 text-primary" />
              <span>{style.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {inheritanceChain.length > 0 && (
        <div className="pt-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
            <Link className="h-3 w-3" /> Inheritance Chain:
          </Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {inheritanceChain.map((style, index) => (
              <React.Fragment key={style.id}>
                <Badge 
                  variant="outline" 
                  className={`
                    text-[10px] px-1.5 py-0 
                    ${index === 0 ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted/50'}
                  `}
                >
                  {style.name}
                </Badge>
                {index < inheritanceChain.length - 1 && (
                  <span className="text-muted-foreground">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      
      {error ? (
        <div className="flex items-center text-xs text-destructive mt-1">
          <AlertCircle className="h-3 w-3 mr-1" />
          <p>{error}</p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground mt-1">
          Inheriting from another style will use its properties as a base for this style.
        </p>
      )}
    </div>
  );
};
