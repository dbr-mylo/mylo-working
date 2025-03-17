
import React from 'react';

interface EmptyContentProps {
  dimensions?: {
    width?: string;
    height?: string;
  };
}

export const EmptyContent: React.FC<EmptyContentProps> = ({ dimensions }) => {
  const width = dimensions?.width || '8.5in';
  const height = dimensions?.height || '11in';
  
  return (
    <div 
      className="flex items-center justify-center bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)]"
      style={{ 
        width, 
        height,
        minHeight: '11in',
        margin: '0 auto'
      }}
    >
      <div className="text-center p-8 text-gray-500">
        <p className="mb-2 text-lg">No content to display</p>
        <p className="text-sm">Start editing to add content to this document</p>
      </div>
    </div>
  );
};
