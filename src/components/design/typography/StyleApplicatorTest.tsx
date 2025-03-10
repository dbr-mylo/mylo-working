
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StyleForm } from "./StyleForm";
import { StyleInheritance } from "./StyleInheritance";
import { StyleDetails } from "./StyleDetails";
import { useStyleApplicatorTest } from "./hooks/useStyleApplicatorTest";

export const StyleApplicatorTest = () => {
  const {
    styles,
    selectedStyleId,
    setSelectedStyleId,
    newStyleId,
    newStyleParentId,
    newStyleProperties,
    handleStyleChange,
    handleSaveNewStyle,
    handleParentChange,
    handleApplyStyle
  } = useStyleApplicatorTest();

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Style Inheritance Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        
        <Card className="p-4">
          <h2 className="text-lg font-medium mb-4">Available Styles</h2>
          
          {styles.length === 0 ? (
            <p className="text-muted-foreground">No styles yet. Create one!</p>
          ) : (
            <div className="space-y-4">
              <Select 
                value={selectedStyleId || undefined} 
                onValueChange={(value) => setSelectedStyleId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  {styles.map(style => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedStyleId && (
                <div className="space-y-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleApplyStyle(selectedStyleId)}
                  >
                    View Style Details
                  </Button>
                  
                  <StyleDetails styleId={selectedStyleId} />
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
