
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StyleBrowser } from "./typography/StyleBrowser";
import { StyleEditor } from "./typography/StyleEditor";
import { useTextStyleManager } from "./typography/useTextStyleManager";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import { ErrorDisplay } from "@/components/errors/ErrorDisplay";

interface TextStyleManagerProps {
  onStylesChange: (styles: string) => void;
}

export const TextStyleManager = ({ onStylesChange }: TextStyleManagerProps) => {
  const [error, setError] = useState<unknown>(null);

  // Use ErrorBoundary to catch any errors in the component tree
  return (
    <ErrorBoundary context="TextStyleManager">
      <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h3 className="text-sm font-medium mb-3">Text Styles</h3>
        
        {error && (
          <ErrorDisplay 
            error={error} 
            context="TextStyleManager" 
            className="mb-4"
            onRetry={() => setError(null)}
          />
        )}
        
        <TextStyleManagerContent 
          onStylesChange={onStylesChange} 
          onError={setError}
        />
      </div>
    </ErrorBoundary>
  );
};

// Separate the content to a child component for better error isolation
const TextStyleManagerContent = ({ 
  onStylesChange,
  onError 
}: { 
  onStylesChange: (styles: string) => void;
  onError: (error: unknown) => void;
}) => {
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
    handleCancelEdit,
    error
  } = useTextStyleManager(onStylesChange);

  // If there's an error from the hook, pass it up
  React.useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  return (
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
  );
};
