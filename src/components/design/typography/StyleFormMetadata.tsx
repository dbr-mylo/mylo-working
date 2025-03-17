
import React from 'react';
import { TextStyle } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StyleFormMetadataProps {
  name: string;
  parentId?: string;
  currentStyleId?: string;
  onNameChange: (name: string) => void;
  onParentChange: (id: string | undefined) => void;
  parentStyle?: TextStyle | null;
  compact?: boolean;
}

export const StyleFormMetadata: React.FC<StyleFormMetadataProps> = ({
  name,
  parentId,
  currentStyleId,
  onNameChange,
  onParentChange,
  parentStyle,
  compact = false
}) => {
  const spacing = compact ? "space-y-2" : "space-y-3";
  
  return (
    <div className={spacing}>
      <div className="space-y-1">
        <Label className="text-xs font-medium">Style Name</Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter style name"
          className="h-7 text-xs"
        />
      </div>
      
      <div className="space-y-1">
        <Label className="text-xs font-medium">Parent Style (Optional)</Label>
        <Select
          value={parentId || ""}
          onValueChange={(value) => onParentChange(value ? value : undefined)}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="None (No Parent)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None (No Parent)</SelectItem>
            {/* Parent styles would be populated here */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
