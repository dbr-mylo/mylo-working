
import React from "react";
import { TextStyle } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Link } from "lucide-react";
import { useDocument } from "@/hooks/document";
import { useParams } from "react-router-dom";
import { convertFontSize, extractFontSizeValue } from "@/lib/types/preferences";

interface InheritanceChainProps {
  inheritanceChain: TextStyle[];
}

export const InheritanceChain = ({ inheritanceChain }: InheritanceChainProps) => {
  const { documentId } = useParams<{ documentId?: string }>();
  const { preferences } = useDocument(documentId);
  const currentUnit = preferences?.typography?.fontUnit || 'px';
  
  if (inheritanceChain.length === 0) {
    return null;
  }

  // Format the font size in each style for display
  const formatFontSize = (fontSize: string) => {
    if (!fontSize) return '';
    
    const { value, unit } = extractFontSizeValue(fontSize);
    if (unit === currentUnit) {
      return fontSize;
    }
    return convertFontSize(fontSize, unit, currentUnit);
  };

  return (
    <div className="pt-2">
      <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
        <Link className="h-3 w-3" /> Inheritance Chain:
      </Label>
      <div className="flex flex-wrap gap-1 mt-1">
        {inheritanceChain.map((style, index) => (
          <React.Fragment key={style.id}>
            <Badge 
              variant="outline" 
              className={`
                text-[10px] px-1.5 py-0 
                ${index === 0 ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted/50'}
              `}
              title={`${style.fontFamily} • ${formatFontSize(style.fontSize)} • ${style.fontWeight}`}
            >
              {style.name}
            </Badge>
            {index < inheritanceChain.length - 1 && (
              <span className="text-muted-foreground">→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
