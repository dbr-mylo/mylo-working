
import React from 'react';
import { TextStyle } from '@/lib/types';
import { Check, Link2 } from 'lucide-react';

interface StyleListItemProps {
  style: TextStyle;
  onSelect: (style: TextStyle) => void;
  isSelected?: boolean;
}

export const StyleListItem = ({ 
  style, 
  onSelect, 
  isSelected = false 
}: StyleListItemProps) => {
  const handleClick = () => {
    onSelect(style);
  };

  return (
    <div 
      className={`
        p-2 rounded-md cursor-pointer hover:bg-accent transition-colors
        flex items-center gap-2 group
        ${isSelected ? 'bg-accent' : ''}
      `}
      onClick={handleClick}
    >
      <div 
        className="flex-1"
        style={{ 
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight,
          fontSize: '0.875rem', // Always show at a readable size
          color: style.color
        }}
      >
        {style.name}
      </div>
      
      {isSelected && (
        <Check className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100" />
      )}
      
      {style.parentId && (
        <Link2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
      )}
    </div>
  );
};
