
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextStyle, TypographyStyles } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { StyleForm } from "./StyleForm";
import { StyleInheritance } from "./StyleInheritance";
import { v4 as uuidv4 } from 'uuid';
import { Badge } from "@/components/ui/badge";

export const StyleApplicatorTest = () => {
  const [styles, setStyles] = useState<TextStyle[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [newStyleId, setNewStyleId] = useState<string>(uuidv4());
  const [newStyleParentId, setNewStyleParentId] = useState<string | undefined>(undefined);
  const [newStyleProperties, setNewStyleProperties] = useState<TypographyStyles>({
    fontFamily: "Inter",
    fontSize: "16px",
    fontWeight: "400",
    color: "#000000",
    lineHeight: "1.5",
    letterSpacing: "0px",
    textAlign: "left"
  });

  // Load all available styles
  useEffect(() => {
    const loadStyles = async () => {
      try {
        console.log("Loading text styles...");
        const loadedStyles = await textStyleStore.getTextStyles();
        console.log("Loaded styles:", loadedStyles);
        setStyles(loadedStyles);
        
        if (loadedStyles.length > 0 && !selectedStyleId) {
          setSelectedStyleId(loadedStyles[0].id);
        }
      } catch (error) {
        console.error("Error loading styles:", error);
      }
    };
    
    loadStyles();
  }, [selectedStyleId]);

  const handleStyleChange = (property: keyof TypographyStyles, value: string) => {
    setNewStyleProperties(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const handleSaveNewStyle = async () => {
    try {
      const styleToSave = {
        id: newStyleId,
        name: `Test Style ${new Date().toISOString().slice(11, 19)}`,
        fontFamily: newStyleProperties.fontFamily,
        fontSize: newStyleProperties.fontSize,
        fontWeight: newStyleProperties.fontWeight,
        color: newStyleProperties.color,
        lineHeight: newStyleProperties.lineHeight,
        letterSpacing: newStyleProperties.letterSpacing,
        textAlign: newStyleProperties.textAlign,
        selector: "p",
        parentId: newStyleParentId
      };
      
      console.log("Saving new style:", styleToSave);
      const savedStyle = await textStyleStore.saveTextStyle(styleToSave);
      console.log("Saved style:", savedStyle);
      
      // Reset for next style
      setNewStyleId(uuidv4());
      setSelectedStyleId(savedStyle.id);
      
      // Refresh styles list
      const updatedStyles = await textStyleStore.getTextStyles();
      setStyles(updatedStyles);
    } catch (error) {
      console.error("Error saving style:", error);
    }
  };

  const handleParentChange = (parentId: string | undefined) => {
    console.log("Parent changed to:", parentId);
    setNewStyleParentId(parentId);
  };

  const handleApplyStyle = async (styleId: string) => {
    try {
      const style = await textStyleStore.getStyleWithInheritance(styleId);
      console.log("Style with inheritance:", style);
    } catch (error) {
      console.error("Error applying style:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Style Inheritance Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-medium mb-4">Create New Style</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="parent-style">Parent Style</Label>
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

// Component to display style details with inheritance
const StyleDetails = ({ styleId }: { styleId: string }) => {
  const [style, setStyle] = useState<TextStyle | null>(null);
  const [inheritanceChain, setInheritanceChain] = useState<TextStyle[]>([]);
  
  useEffect(() => {
    const loadStyleDetails = async () => {
      try {
        // Get the style with inheritance
        const styleWithInheritance = await textStyleStore.getStyleWithInheritance(styleId);
        setStyle(styleWithInheritance);
        
        // Load the inheritance chain
        if (styleWithInheritance?.parentId) {
          const styles = await textStyleStore.getTextStyles();
          const chain: TextStyle[] = [];
          let currentId = styleWithInheritance.parentId;
          
          while (currentId) {
            const parentStyle = styles.find(s => s.id === currentId);
            if (!parentStyle) break;
            
            chain.push(parentStyle);
            currentId = parentStyle.parentId;
          }
          
          setInheritanceChain(chain);
        } else {
          setInheritanceChain([]);
        }
      } catch (error) {
        console.error("Error loading style details:", error);
      }
    };
    
    loadStyleDetails();
  }, [styleId]);
  
  if (!style) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="mt-4 p-3 border rounded-md bg-muted/30">
      <h3 className="font-medium">{style.name}</h3>
      
      {/* Inheritance chain */}
      {inheritanceChain.length > 0 && (
        <div className="mt-2">
          <div className="text-xs text-muted-foreground mb-1">Inherits from:</div>
          <div className="flex flex-wrap gap-1">
            {inheritanceChain.map((parentStyle, index) => (
              <React.Fragment key={parentStyle.id}>
                <Badge variant="outline" className="text-xs">
                  {parentStyle.name}
                </Badge>
                {index < inheritanceChain.length - 1 && (
                  <span className="text-muted-foreground">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      
      {/* Style properties */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Font:</span>{" "}
          {style.fontFamily} {style.fontSize}
        </div>
        <div>
          <span className="text-muted-foreground">Weight:</span>{" "}
          {style.fontWeight}
        </div>
        <div>
          <span className="text-muted-foreground">Color:</span>{" "}
          <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: style.color }}></span>
          {style.color}
        </div>
        <div>
          <span className="text-muted-foreground">Line Height:</span>{" "}
          {style.lineHeight}
        </div>
        <div>
          <span className="text-muted-foreground">Letter Spacing:</span>{" "}
          {style.letterSpacing}
        </div>
        {style.textAlign && (
          <div>
            <span className="text-muted-foreground">Text Align:</span>{" "}
            {style.textAlign}
          </div>
        )}
      </div>
      
      {/* Preview */}
      <div className="mt-3 p-3 bg-white rounded border">
        <p style={{
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          color: style.color,
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing,
          textAlign: style.textAlign as any || "left"
        }}>
          This is a preview of the text style
        </p>
      </div>
    </div>
  );
};
