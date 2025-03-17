
import React, { useState, useEffect } from "react";
import { TextStyle, TypographyStyles, StyleFormData } from "@/lib/types";
import { StyleFormMetadata } from "./StyleFormMetadata";
import { StyleFormControls } from "./StyleFormControls";
import { Button } from "@/components/ui/button";
import { useStyleForm } from "./hooks/useStyleForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { textStyleStore } from "@/stores/textStyles";
import { Badge } from "@/components/ui/badge";
import { StyleInheritance } from "./StyleInheritance";

interface StyleFormProps {
  initialValues?: TextStyle;
  onSubmit?: (data: StyleFormData) => void;
  
  // Support for direct style manipulation
  styles?: TypographyStyles;
  handleStyleChange?: (property: keyof TypographyStyles, value: string) => void;
  compact?: boolean;
}

export const StyleForm = ({ 
  initialValues, 
  onSubmit,
  styles: externalStyles,
  handleStyleChange: externalStyleChange,
  compact = false
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
    onSubmit({
      name,
      selector: "", // Providing empty string as default
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
  
  const buttonSize = compact ? "sm" : "default";
  const spacing = compact ? "space-y-2" : "space-y-3";

  return (
    <form onSubmit={handleSubmit} className={spacing}>
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-2">
          <TabsTrigger value="basic" className="text-xs py-1">Basic Info</TabsTrigger>
          <TabsTrigger value="typography" className="text-xs py-1">Typography</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className={spacing}>
          {showFormFields && (
            <StyleFormMetadata
              name={name}
              parentId={parentId}
              currentStyleId={initialValues?.id}
              onNameChange={setName}
              onParentChange={handleParentChange}
              parentStyle={parentStyle}
              compact={compact}
            />
          )}
        </TabsContent>
        
        <TabsContent value="typography" className={spacing}>
          <StyleFormControls 
            styles={styles}
            onStyleChange={handleStyleChange}
            parentStyle={parentStyle}
            compact={compact}
          />
        </TabsContent>
      </Tabs>

      {showFormFields && (
        <div className="flex justify-end space-x-2 pt-2 border-t mt-2">
          <Button 
            variant="outline" 
            type="button" 
            size={buttonSize}
            onClick={onSubmit ? () => onSubmit({
              name,
              selector: "",
              description: "",
              parentId,
              ...styles,
            }) : undefined}
          >
            Cancel
          </Button>
          <Button type="submit" size={buttonSize}>
            {initialValues ? "Update" : "Create"}
          </Button>
        </div>
      )}
    </form>
  );
};
