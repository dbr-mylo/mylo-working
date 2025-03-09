
import React, { useState, useEffect } from "react";
import { TextStyle, TypographyStyles, StyleFormData } from "@/lib/types";
import { useStyleForm } from "./hooks/useStyleForm";
import { useStyleFormSubmit } from "./hooks/useStyleFormSubmit";
import { StyleFormPreview } from "./StyleFormPreview";
import { StyleFormTabs } from "./StyleFormTabs";
import { StyleFormActions } from "./StyleFormActions";
import { textStyleStore } from "@/stores/textStyles";

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

  const {
    handleSubmit,
    handleCancel,
    showFormFields,
    isUpdate
  } = useStyleFormSubmit({
    initialValues,
    onSubmit
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

  // If both handlers are missing, we're likely in an invalid state
  if (!onSubmit && !externalStyleChange) {
    console.warn("StyleForm requires either onSubmit or handleStyleChange prop");
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e, {
      name,
      selector: "", // Providing empty string as default
      description: "", // Providing empty string as default
      parentId,
      ...styles,
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-3">
      {/* Preview section */}
      <StyleFormPreview styles={styles} parentStyle={parentStyle} />
      
      {/* Form tabs */}
      <StyleFormTabs
        name={name}
        parentId={parentId}
        currentStyleId={initialValues?.id}
        styles={styles}
        onNameChange={setName}
        onParentChange={handleParentChange}
        onStyleChange={handleStyleChange}
        showFormFields={showFormFields}
        parentStyle={parentStyle}
      />

      {/* Form actions */}
      <StyleFormActions
        showActions={showFormFields}
        isUpdate={isUpdate}
        onCancel={handleCancel}
        onSubmit={handleFormSubmit}
      />
    </form>
  );
};
