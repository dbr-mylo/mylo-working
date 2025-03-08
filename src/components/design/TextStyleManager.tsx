
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StyleBrowser } from "./typography/StyleBrowser";
import { StyleEditor } from "./typography/StyleEditor";
import { useTextStyleManager } from "./typography/useTextStyleManager";

interface TextStyleManagerProps {
  onStylesChange: (styles: string) => void;
}

export const TextStyleManager = ({ onStylesChange }: TextStyleManagerProps) => {
  const {
    textStyles,
    selectedStyleId,
    setSelectedStyleId,
    editStyle,
    setEditStyle,
    isEditing,
    setIsEditing,
    handleSaveStyle,
    handleDeleteStyle,
    handleNewStyle,
    handleEditStyle,
    handleCancelEdit
  } = useTextStyleManager(onStylesChange);

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
      <h3 className="text-sm font-medium mb-3">Text Styles</h3>
      
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="browse">Browse Styles</TabsTrigger>
          {isEditing && <TabsTrigger value="edit">Edit Style</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="browse">
          <StyleBrowser
            textStyles={textStyles}
            selectedStyleId={selectedStyleId}
            onSelectStyle={setSelectedStyleId}
            onNewStyle={handleNewStyle}
            onEditStyle={handleEditStyle}
            onDeleteStyle={handleDeleteStyle}
            editStyle={editStyle}
            isEditing={isEditing}
          />
        </TabsContent>
        
        <TabsContent value="edit">
          {isEditing && (
            <StyleEditor
              editStyle={editStyle}
              onStyleChange={setEditStyle}
              onSave={handleSaveStyle}
              onCancel={handleCancelEdit}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
