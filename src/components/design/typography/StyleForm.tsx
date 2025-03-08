
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
    selector,
    setSelector,
    description,
    setDescription,
    parentId,
    handleParentChange,
    styles,
    handleStyleChange
  } = useStyleForm({
    initialValues,
    externalStyles,
    externalStyleChange
  });

  const [activeTab, setActiveTab] = useState("typography");

  const handleSubmit = (e: React.FormEvent) => {
    if (!onSubmit) return;
    
    e.preventDefault();
    onSubmit({
      name,
      selector,
      description,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Always display the preview at the top */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
        <TextPreview styles={styles} />
      </div>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          {showFormFields && (
            <StyleFormMetadata
              name={name}
              selector={selector}
              description={description}
              parentId={parentId}
              currentStyleId={initialValues?.id}
              onNameChange={setName}
              onSelectorChange={setSelector}
              onDescriptionChange={setDescription}
              onParentChange={handleParentChange}
            />
          )}
        </TabsContent>
        
        <TabsContent value="typography" className="space-y-4">
          <StyleFormControls 
            styles={styles}
            onStyleChange={handleStyleChange}
          />
        </TabsContent>
        
        <TabsContent value="spacing" className="space-y-4">
          <div className="text-sm text-muted-foreground text-center py-8">
            Advanced settings will be available in a future update
          </div>
        </TabsContent>
      </Tabs>

      {showFormFields && (
        <div className="flex justify-end space-x-2 pt-6 border-t mt-6">
          <Button variant="outline" type="button" onClick={onSubmit ? () => onSubmit({
            name,
            selector,
            description,
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
