
import { StyleApplicator } from "../typography/StyleApplicator";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { FontUnit, convertFontSize, extractFontSizeValue } from "@/lib/types/preferences";

interface SelectedElementBarProps {
  selectedElement: HTMLElement | null;
  onApplyStyle: (styleId: string) => Promise<void>;
  currentUnit?: FontUnit;
}

export const SelectedElementBar = ({ selectedElement, onApplyStyle, currentUnit }: SelectedElementBarProps) => {
  const [appliedStyle, setAppliedStyle] = useState<TextStyle | null>(null);
  
  useEffect(() => {
    if (!selectedElement) {
      setAppliedStyle(null);
      return;
    }
    
    // Try to detect current style from element 
    const detectAppliedStyle = async () => {
      try {
        const styleId = selectedElement.getAttribute('data-style-id');
        if (styleId) {
          const styles = await textStyleStore.getTextStyles();
          const style = styles.find(s => s.id === styleId);
          if (style) {
            // Convert font size to current unit if needed
            if (currentUnit && style.fontSize) {
              const { unit } = extractFontSizeValue(style.fontSize);
              if (unit !== currentUnit) {
                style.fontSize = convertFontSize(style.fontSize, unit, currentUnit);
              }
            }
            setAppliedStyle(style);
          }
        } else {
          setAppliedStyle(null);
        }
      } catch (error) {
        console.error("Error detecting applied style:", error);
        setAppliedStyle(null);
      }
    };
    
    detectAppliedStyle();
  }, [selectedElement, currentUnit]);

  if (!selectedElement) {
    return null;
  }

  return (
    <div className="mb-4 flex justify-between items-center bg-background p-2 rounded-md">
      <div className="flex items-center gap-2">
        <div className="text-xs">
          <span className="font-medium">Selected: </span>
          <span className="text-muted-foreground">{selectedElement.tagName.toLowerCase()}</span>
        </div>
        
        {appliedStyle && (
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
            {appliedStyle.name} {appliedStyle.fontSize && `• ${appliedStyle.fontSize}`}
          </Badge>
        )}
      </div>
      
      <StyleApplicator 
        onApplyStyle={onApplyStyle}
        selectedElement={selectedElement}
      />
    </div>
  );
};
