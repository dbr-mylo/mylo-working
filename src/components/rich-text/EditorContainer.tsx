
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface EditorContainerProps {
  children: React.ReactNode;
  fixedToolbar?: boolean;
  refProp?: React.RefObject<HTMLDivElement>;
  templateDimensions?: { width: string; height: string };
}

export const EditorContainer: React.FC<EditorContainerProps> = ({ 
  children, 
  fixedToolbar = false,
  refProp,
  templateDimensions
}) => {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  
  // Default dimensions (8.5 x 11 inches)
  const width = templateDimensions?.width || '8.5in';
  const height = templateDimensions?.height || '11in';

  // Don't change behavior for designer role
  if (isDesigner) {
    return (
      <div 
        className={`prose prose-sm max-w-none font-editor designer-editor`}
        ref={refProp}
      >
        <style>
          {`
          .designer-editor .ProseMirror {
            min-height: ${height};
            width: ${width};
            padding: 1in;
            margin: 0 auto;
            background-color: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
          }
          
          .editor-toolbar {
            background-color: white;
            ${!isDesigner ? 'border-bottom: 1px solid #e2e8f0;' : ''}
            padding: 0;
            margin: 0;
            z-index: 10;
          }
          
          .fixed-toolbar {
            position: sticky;
            top: 0;
            z-index: 10;
            width: 100%;
          }
          `}
        </style>
        {children}
      </div>
    );
  }

  // For editor role
  return (
    <div 
      className="prose prose-sm max-w-none font-editor"
      ref={refProp}
    >
      <style>
        {`
        .editor-toolbar {
          background-color: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 0;
          margin: 0;
          z-index: 10;
        }
        
        .fixed-toolbar {
          position: sticky;
          top: 0;
          z-index: 10;
          width: 100%;
        }

        .ProseMirror {
          min-height: ${height};
          width: ${width};
          padding: 0;
          margin: 0 auto;
          overflow-wrap: break-word;
        }
        `}
      </style>
      {children}
    </div>
  );
};
