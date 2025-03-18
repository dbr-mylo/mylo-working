
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StyleInheritance } from "./StyleInheritance";
import { TextStyle } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface StyleFormMetadataProps {
  name: string;
  parentId?: string;
  currentStyleId?: string;
  onNameChange: (value: string) => void;
  onParentChange: (parentId: string | undefined) => void;
  parentStyle?: TextStyle | null;
}

export const StyleFormMetadata = ({
  name,
  parentId,
  currentStyleId,
  onNameChange,
  onParentChange,
  parentStyle
}: StyleFormMetadataProps) => {
  return (
    <>
      {/* Style Name */}
      <div className="mb-2">
        <Label htmlFor="name" className="text-xs mb-0.5 inline-block">
          Style Name <span className="text-destructive">*</span>
        </Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => onNameChange(e.target.value)} 
          placeholder="Heading 1"
          required
          aria-required="true"
        />
        {name.trim() === "" && (
          <p className="text-xs text-destructive mt-1">
            Name is required
          </p>
        )}
      </div>
      
      {/* Style Inheritance */}
      <StyleInheritance
        currentStyleId={currentStyleId}
        parentId={parentId}
        onChange={onParentChange}
      />
      
      {/* Info about inheritance */}
      {parentStyle && (
        <Alert variant="default" className="bg-primary/5 border-primary/20 mt-3">
          <InfoIcon className="h-4 w-4 text-primary" />
          <AlertDescription className="text-xs">
            This style inherits properties from <strong>{parentStyle.name}</strong>. 
            Any property you don't override will use the parent's value.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
