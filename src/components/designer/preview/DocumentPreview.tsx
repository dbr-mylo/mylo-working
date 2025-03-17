
/**
 * DocumentPreview Component
 * 
 * This component renders a preview of a document with custom styles.
 * It is used in both designer and editor contexts.
 */
import React from 'react';
import { Editor } from '@tiptap/react';
import { DocumentStyles } from '@/components/design/preview/DocumentStyles';

interface DocumentPreviewProps {
  content: string;
  customStyles: string;
  isEditable?: boolean;
  onContentChange?: (content: string) => void;
  onElementSelect?: (element: HTMLElement | null) => void;
  renderToolbarOutside?: boolean;
  externalToolbar?: boolean;
  editorInstance?: Editor | null;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  content, 
  customStyles, 
  isEditable = false,
  onContentChange = () => {},
  onElementSelect = () => {},
  renderToolbarOutside = false,
  externalToolbar = false,
  editorInstance = null
}) => {
  return (
    <div className="document-preview">
      {/* Apply custom styles */}
      <DocumentStyles customStyles={customStyles} />
      
      {/* Document content */}
      <div 
        className="document-content"
        dangerouslySetInnerHTML={{ __html: content }}
        onClick={(e) => {
          // Select the clicked element
          if (e.target instanceof HTMLElement) {
            onElementSelect(e.target);
          }
        }}
      />
    </div>
  );
};
