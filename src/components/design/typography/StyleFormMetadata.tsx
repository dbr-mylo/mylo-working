
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StyleInheritance } from "./StyleInheritance";
import { TextStyle } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface ValidationStatus {
  isValid: boolean;
  isDuplicate: boolean;
  isChecking: boolean;
}

interface StyleFormMetadataProps {
  name: string;
  parentId?: string;
  currentStyleId?: string;
  onNameChange: (value: string) => void;
  onParentChange: (parentId: string | undefined) => void;
  parentStyle?: TextStyle | null;
  validationStatus?: ValidationStatus;
}

export const StyleFormMetadata = ({
  name,
  parentId,
  currentStyleId,
  onNameChange,
  onParentChange,
  parentStyle,
  validationStatus
}: StyleFormMetadataProps) => {
  // Determine input style based on validation status
  const getInputClasses = () => {
    if (!name.trim()) return "border-destructive focus-visible:ring-destructive/20";
    if (validationStatus?.isDuplicate) return "border-destructive focus-visible:ring-destructive/20";
    if (validationStatus?.isChecking) return "border-amber-400 focus-visible:ring-amber-300/20";
    if (name.trim() && !validationStatus?.isDuplicate) return "border-green-500 focus-visible:ring-green-500/20";
    return "";
  };
  
  return (
    <>
      {/* Style Name */}
      <div className="mb-2">
        <Label htmlFor="name" className="text-xs mb-0.5 inline-block">
          Style Name <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => onNameChange(e.target.value)} 
            placeholder="Heading 1"
            required
            aria-required="true"
            className={getInputClasses()}
          />
          
          {/* Status indicator */}
          {validationStatus && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {validationStatus.isChecking && (
                <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />
              )}
              {!validationStatus.isChecking && name.trim() && !validationStatus.isDuplicate && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              {validationStatus.isDuplicate && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
          )}
        </div>
        
        {/* Validation messages */}
        {!name.trim() && (
          <p className="text-xs text-destructive mt-1 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Name is required
          </p>
        )}
        {validationStatus?.isDuplicate && (
          <p className="text-xs text-destructive mt-1 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            This name is already in use
          </p>
        )}
        {validationStatus?.isChecking && (
          <p className="text-xs text-amber-500 mt-1 flex items-center">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Checking name availability...
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
