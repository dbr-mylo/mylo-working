
import React, { useState } from "react";
import { TextStyle, TypographyStyles, StyleFormData } from "@/lib/types";
import { StyleFormMetadata } from "./StyleFormMetadata";
import { StyleFormControls } from "./StyleFormControls";
import { Button } from "@/components/ui/button";
import { useStyleForm } from "./hooks/useStyleForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextPreview } from "./TextPreview";

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

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Smaller preview at the top */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-2 mb-2">
        <TextPreview styles={styles} />
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
            />
          )}
        </TabsContent>
        
        <TabsContent value="typography" className="space-y-3">
          <StyleFormControls 
            styles={styles}
            onStyleChange={handleStyleChange}
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
