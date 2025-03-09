
import React from "react";
import { TextStyle } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Check, Link } from "lucide-react";

interface BadgedStyleItemProps {
  style: TextStyle;
  isDefault?: boolean;
  isInherited?: boolean;
  hasChildren?: boolean;
}

export const BadgedStyleItem: React.FC<BadgedStyleItemProps> = ({
  style,
  isDefault = false,
  isInherited = false,
  hasChildren = false,
}) => {
  return (
    <div className="flex gap-1 items-center flex-wrap">
      <span className="font-medium truncate max-w-[150px]">{style.name}</span>
      
      <div className="flex gap-1 ml-auto">
        {isDefault && (
          <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">
            Default
          </Badge>
        )}
        
        {isInherited && (
          <Badge 
            variant="outline" 
            className="text-[9px] px-1 py-0 h-4 bg-primary/10 text-primary border-primary/30 flex items-center gap-0.5"
          >
            <Link className="h-2.5 w-2.5" />
            <span>Inherits</span>
          </Badge>
        )}
        
        {hasChildren && (
          <Badge 
            variant="outline" 
            className="text-[9px] px-1 py-0 h-4 bg-muted text-muted-foreground flex items-center gap-0.5"
          >
            <span>Parent</span>
          </Badge>
        )}
      </div>
    </div>
  );
};
