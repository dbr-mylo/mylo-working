
import React, { useEffect, useState } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { Card } from "@/components/ui/card";

interface StyleDetailsProps {
  styleId: string;
}

export const StyleDetails = ({ styleId }: StyleDetailsProps) => {
  const [style, setStyle] = useState<TextStyle | null>(null);
  const [inheritedStyles, setInheritedStyles] = useState<TextStyle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStyleDetails = async () => {
      try {
        setLoading(true);
        // Get the full style with inheritance
        const fullStyle = await textStyleStore.getStyleWithInheritance(styleId);
        setStyle(fullStyle);
        
        // Get the inheritance chain
        const chain = await textStyleStore.getInheritanceChain(styleId);
        setInheritedStyles(chain);
      } catch (error) {
        console.error("Error loading style details:", error);
        setStyle(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadStyleDetails();
  }, [styleId]);

  if (loading) {
    return <div>Loading style details...</div>;
  }

  if (!style) {
    return <div>Style not found</div>;
  }

  return (
    <Card className="p-3 mt-2">
      <h3 className="text-sm font-medium mb-2">{style.name}</h3>
      
      <div className="text-xs space-y-1 text-muted-foreground">
        <p>Font: {style.fontFamily}, {style.fontSize}</p>
        <p>Weight: {style.fontWeight}</p>
        <p>Color: {style.color}</p>
        <p>Line Height: {style.lineHeight}</p>
        <p>Letter Spacing: {style.letterSpacing}</p>
      </div>
      
      {inheritedStyles.length > 1 && (
        <div className="mt-2 pt-2 border-t border-border">
          <p className="text-xs font-medium">Inheritance Chain:</p>
          <ul className="text-xs text-muted-foreground mt-1">
            {inheritedStyles.map((s, index) => (
              <li key={s.id} className="flex items-center">
                <span>{s.name}</span>
                {index < inheritedStyles.length - 1 && (
                  <span className="mx-1">→</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
