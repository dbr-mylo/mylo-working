import React, { useState, useEffect } from "react";
import { TextStyle, TypographyStyles, StyleFormData } from "@/lib/types";
import { StyleFormMetadata } from "./StyleFormMetadata";
import { StyleFormControls } from "./StyleFormControls";
import { Button } from "@/components/ui/button";
import { useStyleForm } from "./hooks/useStyleForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextPreview } from "./TextPreview";
import { textStyleStore } from "@/stores/textStyles";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useStyleNameValidator } from "./hooks/useStyleNameValidator";

interface StyleFormProps {
  initialValues?: TextStyle;
  onSubmit?: (data: StyleFormData) => void;
  onCancel?: () => void;
  isSaving?: boolean;
  onNameChange?: (name: string) => void;

  // Support for direct style manipulation
  styles?: TypographyStyles;
  handleStyleChange?: (property: keyof TypographyStyles, value: string) => void;
}

export const StyleForm = ({ 
  initialValues, 
  onSubmit,
  onCancel,
  isSaving = false,
  onNameChange,
  styles: externalStyles,
  handleStyleChange: externalStyleChange
}: StyleFormProps) => {
  const [parentStyle, setParentStyle] = useState<TextStyle | null>(null);
  
  const {
    name,
    setName,
    parentId,
    handleParentChange,
    styles,
    handleStyleChange
  } = useStyleForm({
    initialValues,
    externalStyles,
    externalStyleChange
  });
  
  // Use the name validator hook
  const { isDuplicate, isValid } = useStyleNameValidator({
    name,
    currentStyleId: initialValues?.id
  });

  // Call onNameChange when name changes
  useEffect(() => {
    if (onNameChange) {
      onNameChange(name);
    }
  }, [name, onNameChange]);

  // Fetch parent style details when parentId changes
  useEffect(() => {
    if (!parentId) {
      setParentStyle(null);
      return;
    }
    
    const fetchParentStyle = async () => {
      try {
        // Get the style with all inherited properties
        const style = await textStyleStore.getStyleWithInheritance(parentId);
        setParentStyle(style);
      } catch (error) {
        console.error("Error fetching parent style:", error);
        setParentStyle(null);
      }
    };
    
    fetchParentStyle();
  }, [parentId]);

  const handleSubmit = (e: React.FormEvent) => {
    if (!onSubmit) return;
    
    e.preventDefault();
    
    // Form validation
    if (!name.trim()) {
      return; // Don't submit if name is empty
    }
    
    // Check for duplicate names
    if (isDuplicate) {
      return; // Don't submit if name is a duplicate
    }
    
    onSubmit({
      name,
      selector: "p", // Providing default rather than empty string
      description: "", // Providing empty string as default
      parentId,
      ...styles,
    });
  };

  // If both handlers are missing, we're likely in an invalid state
  if (!onSubmit && !externalStyleChange) {
    console.warn("StyleForm requires either onSubmit or handleStyleChange prop");
  }

  // Show form fields for creating/editing styles only when onSubmit is provided
  const showFormFields = !!onSubmit;
  
  // Disable save button if validation fails
  const isSaveDisabled = isSaving || !isValid || isDuplicate;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Smaller preview at the top */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-2 mb-2">
        <TextPreview styles={styles} />
        {parentStyle && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center">
              <Badge variant="outline" className="text-[10px] h-4 bg-primary/10 text-primary border-primary/20">
                Inherits from
              </Badge>
              <span className="text-xs ml-2">{parentStyle.name}</span>
            </div>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-3">
          {showFormFields && (
            <StyleFormMetadata
              name={name}
              parentId={parentId}
              currentStyleId={initialValues?.id}
              onNameChange={setName}
              onParentChange={handleParentChange}
              parentStyle={parentStyle}
            />
          )}
        </TabsContent>
        
        <TabsContent value="typography" className="space-y-3">
          <StyleFormControls 
            styles={styles}
            onStyleChange={handleStyleChange}
            parentStyle={parentStyle}
          />
        </TabsContent>
      </Tabs>

      {showFormFields && (
        <div className="flex justify-end space-x-2 pt-3 border-t mt-3">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSaveDisabled}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              initialValues ? "Update Style" : "Create Style"
            )}
          </Button>
        </div>
      )}
    </form>
  );
};
