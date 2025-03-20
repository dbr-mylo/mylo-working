
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsDesigner } from "@/utils/roles";

interface EmptyContentProps {
  dimensions?: {
    width: string;
    height: string;
  };
}

export const EmptyContent = ({ dimensions }: EmptyContentProps) => {
  const isDesigner = useIsDesigner();
  
  const width = dimensions?.width || '8.5in';
  const height = dimensions?.height || '11in';
  
  if (isDesigner) {
    // For designer role, show an empty box with dimensions matching the editor
    return (
      <div 
        className={`min-h-[${height}] w-[${width}] p-[1in] mx-auto mt-0 bg-white border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]`}
      >
        <p className="text-editor-text opacity-50 font-editor">
          Content from the editor will appear here with brand styling
        </p>
      </div>
    );
  }
  
  // For editor role, keep the existing white box with shadow
  return (
    <div className={`min-h-[${height}] w-[${width}] p-[1in] mx-auto mt-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]`}>
      <p className="text-editor-text opacity-50 font-editor">
        Content from the editor will appear here with brand styling
      </p>
    </div>
  );
};
