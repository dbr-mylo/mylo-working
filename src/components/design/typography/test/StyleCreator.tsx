
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TextStyle, TypographyStyles } from "@/lib/types";
import { StyleForm } from "../StyleForm";
import { StyleInheritance } from "../StyleInheritance";

interface StyleCreatorProps {
  newStyleId: string;
  newStyleParentId: string | undefined;
  newStyleProperties: TypographyStyles;
  onParentChange: (parentId: string | undefined) => void;
  onStyleChange: (property: keyof TypographyStyles, value: string) => void;
  onSaveStyle: () => void;
}

export const StyleCreator = ({
  newStyleId,
  newStyleParentId,
  newStyleProperties,
  onParentChange,
  onStyleChange,
  onSaveStyle
}: StyleCreatorProps) => {
  const handleStyleChange = (property: keyof TypographyStyles, value: string) => {
    onStyleChange(property, value);
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-medium mb-4">Create New Style</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="parent-style">Parent Style</Label>
          <StyleInheritance 
            currentStyleId={newStyleId}
            parentId={newStyleParentId}
            onParentChange={onParentChange}
          />
        </div>
        
        <StyleForm 
          styles={newStyleProperties}
          handleStyleChange={handleStyleChange}
        />
        
        <Button onClick={onSaveStyle}>Save as New Style</Button>
      </div>
    </Card>
  );
};
