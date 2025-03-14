
/**
 * EditorContainer Component
 * 
 * WARNING: This component contains role-specific rendering logic.
 * Changes to the designer role functionality (isDesigner === true) should be avoided.
 * Only modify the editor role section unless absolutely necessary.
 * 
 * The designer code path (first return statement) should remain unchanged.
 */

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

  // DESIGNER PATH - DO NOT MODIFY
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

  // EDITOR PATH - Safe to modify
  return (
    <div 
      className="prose prose-sm max-w-none font-editor"
      ref={refProp}
    >
      <style>
        {`
        /* Toolbar styles - directly above document */
        .editor-toolbar {
          background-color: white;
          padding: 0;
          margin: 0 0 1rem 0;
          z-index: 10;
        }
        
        .fixed-toolbar {
          position: sticky;
          top: 0;
          z-index: 10;
          width: 100%;
        }

        /* Document content styles */
        .ProseMirror {
          min-height: ${height};
          width: ${width};
          padding: 1in;
          margin: 0 auto;
          overflow-wrap: break-word;
          box-sizing: border-box;
          background-color: white;
          border: 1px solid var(--border);
          box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        }

        /* Toolbar container styles */
        .toolbar-container {
          width: ${width};
          margin: 0 auto 1rem auto;
          padding-bottom: 0.5rem;
        }
        `}
      </style>
      {children}
    </div>
  );
};
