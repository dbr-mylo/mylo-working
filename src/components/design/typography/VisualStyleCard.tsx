
import React from "react";
import { TextStyle } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Check, Star, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VisualStyleCardProps {
  style: TextStyle;
  onEdit: (style: TextStyle) => void;
  onApply: (styleId: string) => void;
  isDefault?: boolean;
  isInherited?: boolean;
  hasChildren?: boolean;
  isUsed?: boolean;
  isSelected?: boolean;
}

export const VisualStyleCard = ({
  style,
  onEdit,
  onApply,
  isDefault = false,
  isInherited = false,
  hasChildren = false,
  isUsed = false,
  isSelected = false
}: VisualStyleCardProps) => {
  return (
    <Card 
      className={`p-3 hover:bg-accent/10 transition-colors ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium text-sm truncate max-w-[150px]">
          {style.name}
        </span>
        {isSelected && <Check className="h-4 w-4 text-primary" />}
      </div>
      
      <div 
        className="py-2 px-1 my-2 bg-white rounded border border-gray-100"
        style={{ 
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          color: style.color,
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing,
          textAlign: style.textAlign as "left" | "center" | "right" | "justify"
        }}
      >
        The quick brown fox
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-1">
          {isDefault && (
            <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">
              Default
            </Badge>
          )}
          
          {isUsed && (
            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 flex items-center gap-0.5 text-green-600 border-green-200 bg-green-50">
              <Star className="h-2.5 w-2.5" />
              <span>Used</span>
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
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => onEdit(style)}
            title="Edit style"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => onApply(style.id)}
            title="Apply style to selected text"
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
