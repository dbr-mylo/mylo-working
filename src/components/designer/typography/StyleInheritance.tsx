
import React from 'react';
import { TextStyle } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Link } from "lucide-react";

interface StyleInheritanceProps {
  inheritanceChain: TextStyle[];
}

export const StyleInheritance: React.FC<StyleInheritanceProps> = ({
  inheritanceChain
}) => {
  if (inheritanceChain.length === 0) {
    return null;
  }

  return (
    <div className="pt-2">
      <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
        <Link className="h-3 w-3" /> Inheritance Chain:
      </div>
      <div className="flex flex-wrap gap-1 mt-1">
        {inheritanceChain.map((style, index) => (
          <React.Fragment key={style.id}>
            <Badge 
              variant="outline" 
              className={`
                text-[10px] px-1.5 py-0 
                ${index === 0 ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted/50'}
              `}
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
