
import React from "react";
import { Label } from "@/components/ui/label";

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
    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
      <Label className="text-xs text-gray-500 mb-2 block">Preview</Label>
      <div style={{ 
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        lineHeight: styles.lineHeight,
        letterSpacing: styles.letterSpacing,
        textAlign: styles.textAlign as "left" | "center" | "right" | "justify"
      }}>
        The quick brown fox jumps over the lazy dog
      </div>
    </div>
  );
};
