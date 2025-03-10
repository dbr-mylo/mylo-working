
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
import { StyleInheritance } from "./StyleInheritance";
import { useDocument } from "@/hooks/document";
import { useParams } from "react-router-dom";
import { convertFontSize, extractFontSizeValue } from "@/lib/types/preferences";

interface StyleFormProps {
  initialValues?: TextStyle;
  onSubmit?: (data: StyleFormData) => void;
  
  // Support for direct style manipulation
  styles?: TypographyStyles;
  handleStyleChange?: (property: keyof TypographyStyles, value: string) => void;
}

export const StyleForm = ({ 
  initialValues, 
  onSubmit,
  styles: externalStyles,
  handleStyleChange: externalStyleChange
}: StyleFormProps) => {
  const [parentStyle, setParentStyle] = useState<TextStyle | null>(null);
  const { documentId } = useParams<{ documentId?: string }>();
  const { preferences } = useDocument(documentId);
  const currentUnit = preferences?.typography?.fontUnit || 'px';
  
  // Convert initial values if needed
  const convertedInitialValues = initialValues ? {
    ...initialValues,
    fontSize: convertInitialFontSize(initialValues.fontSize, currentUnit)
  } : undefined;
  
  const {
    name,
    setName,
    parentId,
    handleParentChange,
    styles,
    handleStyleChange
  } = useStyleForm({
    initialValues: convertedInitialValues,
    externalStyles,
    externalStyleChange
  });

  // Convert font size when preference changes
  useEffect(() => {
    if (!initialValues || externalStyles) return;
    
    const { value, unit } = extractFontSizeValue(initialValues.fontSize);
    if (unit !== currentUnit) {
      const convertedSize = convertFontSize(initialValues.fontSize, unit, currentUnit);
      handleStyleChange('fontSize', convertedSize);
    }
  }, [currentUnit, initialValues, externalStyles]);

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
        if (style) {
          // Convert font size of parent style if needed
          const { unit } = extractFontSizeValue(style.fontSize);
          if (unit !== currentUnit) {
            style.fontSize = convertFontSize(style.fontSize, unit, currentUnit);
          }
          setParentStyle(style);
        }
      } catch (error) {
        console.error("Error fetching parent style:", error);
        setParentStyle(null);
      }
    };
    
    fetchParentStyle();
  }, [parentId, currentUnit]);

  const handleSubmit = (e: React.FormEvent) => {
    if (!onSubmit) return;
    
    e.preventDefault();
    
    // Ensure font size is in the correct format before saving
    const stylesToSave = { ...styles };
    
    // Convert to the appropriate unit if necessary
    const { unit } = extractFontSizeValue(stylesToSave.fontSize);
    if (unit !== currentUnit) {
      stylesToSave.fontSize = convertFontSize(stylesToSave.fontSize, unit, currentUnit);
    }
    
    onSubmit({
      name,
      selector: "", // Providing empty string as default
      description: "", // Providing empty string as default
      parentId,
      ...stylesToSave,
    });
  };

  // If both handlers are missing, we're likely in an invalid state
  if (!onSubmit && !externalStyleChange) {
    console.warn("StyleForm requires either onSubmit or handleStyleChange prop");
  }

  // Show form fields for creating/editing styles only when onSubmit is provided
  const showFormFields = !!onSubmit;

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
          <Button variant="outline" type="button" onClick={onSubmit ? () => onSubmit({
            name,
            selector: "",
            description: "",
            parentId,
            ...styles,
          }) : undefined}>
            Cancel
          </Button>
          <Button type="submit">
            {initialValues ? "Update Style" : "Create Style"}
          </Button>
        </div>
      )}
    </form>
  );
};

// Helper function to convert initial font size to the current unit
const convertInitialFontSize = (fontSize: string, currentUnit: string) => {
  const { unit, value } = extractFontSizeValue(fontSize);
  if (unit === currentUnit) return fontSize;
  return convertFontSize(fontSize, unit, currentUnit as 'px' | 'pt');
};
