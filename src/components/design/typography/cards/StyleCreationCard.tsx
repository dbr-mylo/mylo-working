
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StyleForm } from "../StyleForm";
import { StyleInheritance } from "../StyleInheritance";
import { TypographyStyles } from "@/lib/types";

interface StyleCreationCardProps {
  newStyleId: string;
  newStyleParentId: string | undefined;
  newStyleProperties: TypographyStyles;
  handleStyleChange: (property: keyof TypographyStyles, value: string) => void;
  handleParentChange: (parentId: string | undefined) => void;
  handleSaveNewStyle: () => void;
}

export const StyleCreationCard = ({
  newStyleId,
  newStyleParentId,
  newStyleProperties,
  handleStyleChange,
  handleParentChange,
  handleSaveNewStyle
}: StyleCreationCardProps) => {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-medium mb-4">Create New Style</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="parent-style" className="block text-sm font-medium text-gray-700 mb-1">
            Parent Style
          </label>
          <StyleInheritance 
            currentStyleId={newStyleId}
            parentId={newStyleParentId}
            onChange={handleParentChange}
          />
        </div>
        
        <StyleForm 
          styles={newStyleProperties}
          handleStyleChange={handleStyleChange}
        />
        
        <Button onClick={handleSaveNewStyle}>Save as New Style</Button>
      </div>
    </Card>
  );
};
