
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StyleInheritance } from "./StyleInheritance";

interface StyleFormMetadataProps {
  name: string;
  selector: string;
  description: string;
  parentId?: string;
  currentStyleId?: string;
  onNameChange: (value: string) => void;
  onSelectorChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onParentChange: (parentId: string | undefined) => void;
}

export const StyleFormMetadata = ({
  name,
  selector,
  description,
  parentId,
  currentStyleId,
  onNameChange,
  onSelectorChange,
  onDescriptionChange,
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

      {/* CSS Selector */}
      <div className="grid gap-2">
        <Label htmlFor="selector">CSS Selector</Label>
        <Input 
          id="selector" 
          value={selector} 
          onChange={(e) => onSelectorChange(e.target.value)} 
          placeholder="h1, .heading-1"
        />
      </div>

      {/* Description */}
      <div className="grid gap-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input 
          id="description" 
          value={description} 
          onChange={(e) => onDescriptionChange(e.target.value)} 
          placeholder="Main heading style"
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
