
import React, { useState, useEffect, useRef, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextStyle } from "@/lib/types";
import { StyleApplicator } from "./StyleApplicator";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";

export const StyleApplicatorTest = () => {
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Sample text elements for testing
  const sampleElements = [
    { tag: "h1", content: "This is a Heading 1" },
    { tag: "h2", content: "This is a Heading 2" },
    { tag: "h3", content: "This is a Heading 3" },
    { tag: "p", content: "This is a paragraph with some text content for testing styles." },
    { tag: "blockquote", content: "This is a blockquote element." },
  ];

  // Generic handler for any HTML element
  const handleElementClick = (e: MouseEvent<HTMLElement>) => {
    console.log("Element clicked:", e.currentTarget.tagName);
    
    // Remove previous selection
    if (selectedElement) {
      selectedElement.classList.remove("ring-2", "ring-primary");
    }
    
    // Set new selection
    const element = e.currentTarget;
    element.classList.add("ring-2", "ring-primary");
    setSelectedElement(element);
    
    toast({
      title: "Element selected",
      description: `Selected ${element.tagName.toLowerCase()} element`,
    });
  };

  const handleApplyStyle = async (styleId: string) => {
    if (!selectedElement) {
      toast({
        title: "No element selected",
        description: "Please select a text element first",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Applying style:", styleId);
      // Get the style with all inherited properties
      const style = await textStyleStore.getStyleWithInheritance(styleId);
      console.log("Style to apply:", style);
      
      // Apply style to selected element
      if (style) {
        selectedElement.style.fontFamily = style.fontFamily;
        selectedElement.style.fontSize = style.fontSize;
        selectedElement.style.fontWeight = style.fontWeight;
        selectedElement.style.color = style.color;
        selectedElement.style.lineHeight = style.lineHeight;
        selectedElement.style.letterSpacing = style.letterSpacing;
        
        if (style.textAlign) {
          selectedElement.style.textAlign = style.textAlign;
        }
        
        toast({
          title: "Style applied",
          description: `Applied "${style.name}" style to selected element`,
        });
      }
    } catch (error) {
      console.error("Error applying style:", error);
      toast({
        title: "Error",
        description: "Failed to apply style",
        variant: "destructive",
      });
    }
  };

  const createDefaultStyles = async () => {
    try {
      console.log("Creating default styles...");
      // Create some default styles for testing if none exist
      const styles = await textStyleStore.getTextStyles();
      console.log("Current styles:", styles);
      
      if (styles.length === 0) {
        console.log("No styles found, creating defaults...");
        const defaultStyles = [
          {
            name: "Heading 1",
            fontFamily: "Georgia, serif",
            fontSize: "32px",
            fontWeight: "700",
            color: "#222222",
            lineHeight: "1.2",
            letterSpacing: "0px",
            selector: "h1",
            textAlign: "left",
          },
          {
            name: "Heading 2",
            fontFamily: "Georgia, serif",
            fontSize: "24px",
            fontWeight: "600",
            color: "#333333",
            lineHeight: "1.3",
            letterSpacing: "0px",
            selector: "h2",
            textAlign: "left",
          },
          {
            name: "Body Text",
            fontFamily: "Arial, sans-serif",
            fontSize: "16px",
            fontWeight: "400",
            color: "#444444",
            lineHeight: "1.5",
            letterSpacing: "0.2px",
            selector: "p",
            textAlign: "left",
          },
          {
            name: "Quote",
            fontFamily: "Georgia, serif",
            fontSize: "18px",
            fontWeight: "400",
            color: "#555555",
            lineHeight: "1.5",
            letterSpacing: "0.1px",
            selector: "blockquote",
            textAlign: "left",
            textDecoration: "none",
            textTransform: "none",
          }
        ];

        for (const style of defaultStyles) {
          await textStyleStore.saveTextStyle(style as any);
        }
        
        toast({
          title: "Default styles created",
          description: "Created sample text styles for testing",
        });
      }
    } catch (error) {
      console.error("Error creating default styles:", error);
    }
  };

  useEffect(() => {
    // Create default styles when component mounts
    console.log("StyleApplicatorTest mounted");
    createDefaultStyles();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Style Applicator Test</h2>
        <StyleApplicator onApplyStyle={handleApplyStyle} selectedElement={selectedElement} />
      </div>
      
      <Card className="p-6">
        <div className="mb-4 text-sm text-muted-foreground">
          Click on any text element below to select it, then use the "Apply Style" button to apply a style.
        </div>
        
        <div ref={contentRef} className="space-y-6 p-4 border rounded-md">
          {sampleElements.map((element, index) => {
            if (element.tag === "h1") {
              return <h1 key={index} onClick={handleElementClick} className="cursor-pointer hover:bg-muted/20 p-2 transition-colors">{element.content}</h1>;
            } else if (element.tag === "h2") {
              return <h2 key={index} onClick={handleElementClick} className="cursor-pointer hover:bg-muted/20 p-2 transition-colors">{element.content}</h2>;
            } else if (element.tag === "h3") {
              return <h3 key={index} onClick={handleElementClick} className="cursor-pointer hover:bg-muted/20 p-2 transition-colors">{element.content}</h3>;
            } else if (element.tag === "blockquote") {
              return <blockquote key={index} onClick={handleElementClick} className="cursor-pointer hover:bg-muted/20 p-2 transition-colors">{element.content}</blockquote>;
            } else {
              return <p key={index} onClick={handleElementClick} className="cursor-pointer hover:bg-muted/20 p-2 transition-colors">{element.content}</p>;
            }
          })}
        </div>
      </Card>
    </div>
  );
};
