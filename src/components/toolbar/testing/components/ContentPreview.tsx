
import React from 'react';

interface ContentPreviewProps {
  content: string;
  label: string;
}

export const ContentPreview: React.FC<ContentPreviewProps> = ({ content, label }) => {
  return (
    <div className="p-4 border rounded-md bg-muted/40">
      <h3 className="text-sm font-medium mb-2">{label}</h3>
      <div 
        className="min-h-20 p-2 bg-white rounded border" 
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </div>
  );
};
