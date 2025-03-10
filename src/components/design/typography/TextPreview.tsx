
import React from "react";
import { useDocument } from "@/hooks/document";
import { useParams } from "react-router-dom";
import { extractFontSizeValue, convertFontSize } from "@/lib/types/preferences";

interface TextPreviewProps {
  styles: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    color: string;
    lineHeight: string;
    letterSpacing: string;
    textAlign: string;
  };
}

export const TextPreview = ({ styles }: TextPreviewProps) => {
  const { documentId } = useParams<{ documentId?: string }>();
  const { preferences } = useDocument(documentId);
  const currentUnit = preferences?.typography?.fontUnit || 'px';
  
  // Format font size for display and ensure it's in the correct unit
  const formatFontSize = (fontSize: string): string => {
    const { value, unit } = extractFontSizeValue(fontSize);
    if (unit === currentUnit) {
      return fontSize;
    }
    return convertFontSize(fontSize, unit, currentUnit);
  };
  
  // Get the converted font size
  const displayFontSize = formatFontSize(styles.fontSize);
  
  return (
    <div className="flex flex-col space-y-0.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium">Preview</h3>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <span>{styles.fontFamily}</span>
          <span>•</span>
          <span>{displayFontSize}</span>
          <span>•</span>
          <span>Weight: {styles.fontWeight}</span>
        </div>
      </div>
      
      <div 
        className="py-1"
        style={{ 
          fontFamily: styles.fontFamily,
          fontSize: displayFontSize,
          fontWeight: styles.fontWeight,
          color: styles.color,
          lineHeight: styles.lineHeight,
          letterSpacing: styles.letterSpacing,
          textAlign: styles.textAlign as "left" | "center" | "right" | "justify"
        }}
      >
        The quick brown fox jumps over the lazy dog.
      </div>
    </div>
  );
};
