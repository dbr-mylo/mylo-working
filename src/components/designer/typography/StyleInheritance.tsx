
import React from 'react';
import { TextStyle } from "@/lib/types";

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
    <div className="space-y-2">
      <h4 className="text-xs font-medium">Inheritance Chain</h4>
      <div className="space-y-1">
        {inheritanceChain.map((style, index) => (
          <div 
            key={style.id} 
            className="text-xs flex items-center"
            style={{ paddingLeft: `${index * 10}px` }}
          >
            {index > 0 && <span className="mr-2">↳</span>}
            <span>{style.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
