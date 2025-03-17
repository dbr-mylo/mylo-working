
import React from 'react';
import { TextStyle } from "@/lib/types";

interface StyleFormMetadataProps {
  name: string;
  parentId?: string;
  currentStyleId?: string;
  onNameChange: (name: string) => void;
  onParentChange: (id: string | undefined) => void;
  parentStyle?: TextStyle | null;
}

export const StyleFormMetadata: React.FC<StyleFormMetadataProps> = ({
  name,
  parentId,
  currentStyleId,
  onNameChange,
  onParentChange,
  parentStyle
}) => {
  // Simple implementation for now
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs font-medium">Style Name</label>
        <input
          type="text"
          className="w-full text-xs p-2 border rounded"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter style name"
        />
      </div>
      
      <div className="space-y-1">
        <label className="text-xs font-medium">Parent Style (Optional)</label>
        <select
          className="w-full text-xs p-2 border rounded"
          value={parentId || ""}
          onChange={(e) => {
            const value = e.target.value;
            onParentChange(value ? value : undefined);
          }}
        >
          <option value="">None (No Parent)</option>
          {/* Parent styles would be populated here */}
        </select>
      </div>
    </div>
  );
};
