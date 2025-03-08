
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StyleInheritance } from "./StyleInheritance";

interface StyleFormMetadataProps {
  name: string;
  parentId?: string;
  currentStyleId?: string;
  onNameChange: (value: string) => void;
  onParentChange: (parentId: string | undefined) => void;
}

export const StyleFormMetadata = ({
  name,
  parentId,
  currentStyleId,
  onNameChange,
  onParentChange
}: StyleFormMetadataProps) => {
  return (
    <>
      {/* Style Name */}
      <div className="grid gap-2">
        <Label htmlFor="name">Style Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => onNameChange(e.target.value)} 
          placeholder="Heading 1"
          required
        />
      </div>
      
      {/* Style Inheritance */}
      <StyleInheritance
        currentStyleId={currentStyleId}
        parentId={parentId}
        onChange={onParentChange}
      />
    </>
  );
};
