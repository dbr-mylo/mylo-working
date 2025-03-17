
import React, { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { Badge } from "@/components/ui/badge";

interface StyleDetailsProps {
  styleId: string;
}

export const StyleDetails = ({ styleId }: StyleDetailsProps) => {
  const [style, setStyle] = useState<TextStyle | null>(null);
  const [inheritanceChain, setInheritanceChain] = useState<TextStyle[]>([]);
  
  useEffect(() => {
    const loadStyleDetails = async () => {
      try {
        const styleWithInheritance = await textStyleStore.getStyleWithInheritance(styleId);
        setStyle(styleWithInheritance);
        
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
