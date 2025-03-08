
import React from "react";

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
  return (
    <div className="flex flex-col space-y-0.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium">Preview</h3>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <span>{styles.fontFamily}</span>
          <span>•</span>
          <span>{styles.fontSize}</span>
          <span>•</span>
          <span>Weight: {styles.fontWeight}</span>
        </div>
      </div>
      
      <div 
        className="py-1"
        style={{ 
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
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
