
import React from "react";
import { TextStyle, TypographyStyles } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StyleFormMetadata } from "./StyleFormMetadata";
import { StyleFormControls } from "./StyleFormControls";

interface StyleFormTabsProps {
  name: string;
  parentId?: string;
  currentStyleId?: string;
  styles: TypographyStyles;
  onNameChange: (value: string) => void;
  onParentChange: (parentId: string | undefined) => void;
  onStyleChange: (property: keyof TypographyStyles, value: string) => void;
  showFormFields: boolean;
  parentStyle: TextStyle | null;
}

export const StyleFormTabs = ({
  name,
  parentId,
  currentStyleId,
  styles,
  onNameChange,
  onParentChange,
  onStyleChange,
  showFormFields,
  parentStyle
}: StyleFormTabsProps) => {
  return (
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
            currentStyleId={currentStyleId}
            onNameChange={onNameChange}
            onParentChange={onParentChange}
            parentStyle={parentStyle}
          />
        )}
      </TabsContent>
      
      <TabsContent value="typography" className="space-y-3">
        <StyleFormControls 
          styles={styles}
          onStyleChange={onStyleChange}
          parentStyle={parentStyle}
        />
      </TabsContent>
    </Tabs>
  );
};
