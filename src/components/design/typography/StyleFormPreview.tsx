
import React from "react";
import { TextStyle, TypographyStyles } from "@/lib/types";
import { TextPreview } from "./TextPreview";
import { Badge } from "@/components/ui/badge";

interface StyleFormPreviewProps {
  styles: TypographyStyles;
  parentStyle: TextStyle | null;
}

export const StyleFormPreview = ({ styles, parentStyle }: StyleFormPreviewProps) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-2 mb-2">
      <TextPreview styles={styles} />
      {parentStyle && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center">
            <Badge variant="outline" className="text-[10px] h-4 bg-primary/10 text-primary border-primary/20">
              Inherits from
            </Badge>
            <span className="text-xs ml-2">{parentStyle.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};
