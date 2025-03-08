
import React, { useState } from "react";
import { TextStyle, TypographyStyles, StyleFormData } from "@/lib/types";
import { FontFamilyControl } from "./FontFamilyControl";
import { FontSizeControl } from "./FontSizeControl";
import { FontWeightControl } from "./FontWeightControl";
import { ColorControl } from "./ColorControl";
import { SpacingControl } from "./SpacingControl";
import { TextAlignmentControl } from "./TextAlignmentControl";
import { TextPreview } from "./TextPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StyleFormProps {
  initialValues?: TextStyle;
  onSubmit: (data: StyleFormData) => void;
}

export const StyleForm = ({ initialValues, onSubmit }: StyleFormProps) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [selector, setSelector] = useState(initialValues?.selector || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  
  const [styles, setStyles] = useState<TypographyStyles>({
    fontFamily: initialValues?.fontFamily || "Inter",
    fontSize: initialValues?.fontSize || "16px",
    fontWeight: initialValues?.fontWeight || "400",
    color: initialValues?.color || "#000000",
    lineHeight: initialValues?.lineHeight || "1.5",
    letterSpacing: initialValues?.letterSpacing || "0px",
    textAlign: initialValues?.textAlign || "left",
  });

  const handleStyleChange = (property: keyof TypographyStyles, value: string) => {
    setStyles(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      selector,
      description,
      ...styles,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="space-y-4">
        {/* Font Family */}
        <FontFamilyControl 
          value={styles.fontFamily} 
          onChange={(value) => handleStyleChange("fontFamily", value)} 
        />

        {/* Font Size */}
        <FontSizeControl 
          value={styles.fontSize} 
          onChange={(value) => handleStyleChange("fontSize", value)} 
        />

        {/* Font Weight */}
        <FontWeightControl 
          value={styles.fontWeight} 
          onChange={(value) => handleStyleChange("fontWeight", value)} 
        />

        {/* Text Color */}
        <ColorControl 
          value={styles.color} 
          onChange={(value) => handleStyleChange("color", value)} 
        />

        {/* Line Height */}
        <SpacingControl 
          type="lineHeight"
          value={styles.lineHeight} 
          onChange={(value) => handleStyleChange("lineHeight", value)} 
        />

        {/* Letter Spacing */}
        <SpacingControl 
          type="letterSpacing"
          value={styles.letterSpacing} 
          onChange={(value) => handleStyleChange("letterSpacing", value)} 
        />

        {/* Text Alignment */}
        <TextAlignmentControl 
          value={styles.textAlign} 
          onChange={(value) => handleStyleChange("textAlign", value)} 
        />

        {/* Preview */}
        <TextPreview styles={styles} />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          {initialValues ? "Update Style" : "Create Style"}
        </Button>
      </div>
    </form>
  );
};
