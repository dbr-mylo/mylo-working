
import React from "react";
import { TextStyle, TypographyStyles, StyleFormData } from "@/lib/types";
import { StyleFormMetadata } from "./StyleFormMetadata";
import { StyleFormControls } from "./StyleFormControls";
import { Button } from "@/components/ui/button";
import { useStyleForm } from "./hooks/useStyleForm";

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

      <StyleFormControls 
        styles={styles}
        onStyleChange={handleStyleChange}
      />

      {showFormFields && (
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit">
            {initialValues ? "Update Style" : "Create Style"}
          </Button>
        </div>
      )}
    </form>
  );
};
