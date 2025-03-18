
import React from "react";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useStyleInheritance } from "./hooks/useStyleInheritance";
import { StyleInheritanceSelect } from "./StyleInheritanceSelect";
import { InheritanceChain } from "./InheritanceChain";
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
  const { toast } = useToast();
  const { styles, loading, error, inheritanceChain } = useStyleInheritance({
    currentStyleId,
    parentId
  });

  const handleParentChange = (value: string | undefined) => {
    try {
      if (value !== undefined && styles.findIndex(s => s.id === value) === -1) {
        throw new Error("Selected style is not valid as a parent");
      }
      
      onChange(value);
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
      
      <StyleInheritanceSelect
        styles={styles}
        parentId={parentId}
        onChange={handleParentChange}
        disabled={disabled}
        loading={loading}
        error={error}
      />
      
      <InheritanceChain inheritanceChain={inheritanceChain} />
      
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
