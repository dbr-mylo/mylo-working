
import React from 'react';
import { TextStyle, TypographyStyles } from "@/lib/types";

interface StyleFormControlsProps {
  styles: TypographyStyles;
  onStyleChange: (property: keyof TypographyStyles, value: string) => void;
  parentStyle?: TextStyle | null;
}

export const StyleFormControls: React.FC<StyleFormControlsProps> = ({
  styles,
  onStyleChange,
  parentStyle
}) => {
  // Basic component structure - will be fully implemented later
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium">Font Family</label>
          <select 
            className="w-full text-xs p-2 border rounded"
            value={styles.fontFamily}
            onChange={(e) => onStyleChange('fontFamily', e.target.value)}
          >
            <option value="Inter">Inter</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-medium">Font Size</label>
          <input 
            type="text"
            className="w-full text-xs p-2 border rounded"
            value={styles.fontSize}
            onChange={(e) => onStyleChange('fontSize', e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium">Font Weight</label>
          <select
            className="w-full text-xs p-2 border rounded"
            value={styles.fontWeight}
            onChange={(e) => onStyleChange('fontWeight', e.target.value)}
          >
            <option value="400">Regular (400)</option>
            <option value="700">Bold (700)</option>
          </select>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-medium">Color</label>
          <input
            type="color"
            className="w-full h-8 p-0 border rounded"
            value={styles.color}
            onChange={(e) => onStyleChange('color', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
