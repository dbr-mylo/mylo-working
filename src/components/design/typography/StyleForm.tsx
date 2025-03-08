
import React, { useState, useEffect } from "react";
import { TextStyle, TypographyStyles, StyleFormData } from "@/lib/types";
import { FontFamilyControl } from "./FontFamilyControl";
import { FontSizeControl } from "./FontSizeControl";
import { FontWeightControl } from "./FontWeightControl";
import { ColorControl } from "./ColorControl";
import { SpacingControl } from "./SpacingControl";
import { TextAlignmentControl } from "./TextAlignmentControl";
import { TextPreview } from "./TextPreview";
import { StyleInheritance } from "./StyleInheritance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  // State for using the form in "controlled mode"
  const [name, setName] = useState(initialValues?.name || "");
  const [selector, setSelector] = useState(initialValues?.selector || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [parentId, setParentId] = useState(initialValues?.parentId);
  
  // Internal styles state when not in controlled mode
  const [internalStyles, setInternalStyles] = useState<TypographyStyles>({
    fontFamily: initialValues?.fontFamily || "Inter",
    fontSize: initialValues?.fontSize || "16px",
    fontWeight: initialValues?.fontWeight || "400",
    color: initialValues?.color || "#000000",
    lineHeight: initialValues?.lineHeight || "1.5",
    letterSpacing: initialValues?.letterSpacing || "0px",
    textAlign: initialValues?.textAlign || "left",
  });

  // Use either external or internal styles
  const styles = externalStyles || internalStyles;

  // Update internal styles when initialValues change
  useEffect(() => {
    if (initialValues && !externalStyles) {
      setName(initialValues.name || "");
      setSelector(initialValues.selector || "");
      setDescription(initialValues.description || "");
      setParentId(initialValues.parentId);
      
      setInternalStyles({
        fontFamily: initialValues.fontFamily || "Inter",
        fontSize: initialValues.fontSize || "16px",
        fontWeight: initialValues.fontWeight || "400",
        color: initialValues.color || "#000000",
        lineHeight: initialValues.lineHeight || "1.5",
        letterSpacing: initialValues.letterSpacing || "0px",
        textAlign: initialValues.textAlign || "left",
      });
    }
  }, [initialValues, externalStyles]);

  const handleStyleChangeInternal = (property: keyof TypographyStyles, value: string) => {
    if (externalStyleChange) {
      // Use external handler if provided
      externalStyleChange(property, value);
    } else {
      // Otherwise update internal state
      setInternalStyles(prev => ({
        ...prev,
        [property]: value
      }));
    }
  };

  const handleParentChange = (newParentId: string | undefined) => {
    setParentId(newParentId);
  };

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
        <>
          {/* Style Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Style Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
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
              onChange={(e) => setSelector(e.target.value)} 
              placeholder="h1, .heading-1"
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Main heading style"
            />
          </div>
          
          {/* Style Inheritance */}
          <StyleInheritance
            currentStyleId={initialValues?.id}
            parentId={parentId}
            onChange={handleParentChange}
          />
        </>
      )}

      <div className="space-y-4">
        {/* Font Family */}
        <FontFamilyControl 
          value={styles.fontFamily} 
          onChange={(value) => handleStyleChangeInternal("fontFamily", value)} 
        />

        {/* Font Size */}
        <FontSizeControl 
          value={styles.fontSize} 
          onChange={(value) => handleStyleChangeInternal("fontSize", value)} 
        />

        {/* Font Weight */}
        <FontWeightControl 
          value={styles.fontWeight} 
          onChange={(value) => handleStyleChangeInternal("fontWeight", value)} 
        />

        {/* Text Color */}
        <ColorControl 
          value={styles.color} 
          onChange={(value) => handleStyleChangeInternal("color", value)} 
        />

        {/* Line Height */}
        <SpacingControl 
          type="lineHeight"
          value={styles.lineHeight} 
          onChange={(value) => handleStyleChangeInternal("lineHeight", value)} 
        />

        {/* Letter Spacing */}
        <SpacingControl 
          type="letterSpacing"
          value={styles.letterSpacing} 
          onChange={(value) => handleStyleChangeInternal("letterSpacing", value)} 
        />

        {/* Text Alignment */}
        <TextAlignmentControl 
          value={styles.textAlign} 
          onChange={(value) => handleStyleChangeInternal("textAlign", value)} 
        />

        {/* Preview */}
        <TextPreview styles={styles} />
      </div>

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
