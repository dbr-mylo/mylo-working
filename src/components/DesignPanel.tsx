
import type { DesignPanelProps } from "@/lib/types";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentPreview } from "@/components/design/DocumentPreview";

interface ExtendedDesignPanelProps extends DesignPanelProps {
  onElementSelect?: (element: HTMLElement | null) => void;
  customStyles?: string;
}

export const DesignPanel = ({ 
  content, 
  isEditable,
  onElementSelect,
  customStyles = "" 
}: ExtendedDesignPanelProps) => {
  const { width } = useWindowSize();
  const { role } = useAuth();
  const isMobile = width < 1281;
  const isStandalone = role === "designer";
  const [designContent, setDesignContent] = useState(content);
  
  // Update local content when prop changes (for when editor updates content)
  if (content !== designContent && !isEditable) {
    setDesignContent(content);
  }
  
  const handleContentChange = (newContent: string) => {
    setDesignContent(newContent);
  };

  return (
    <div className={`${isStandalone ? 'w-full' : isMobile ? 'w-full' : 'flex-1'} p-4 md:p-8 bg-editor-panel ${!isMobile ? 'animate-slide-in' : ''} overflow-auto`}>
      <div className="mx-auto">
        {!isMobile && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-editor-text">Design Panel</h2>
            {isEditable ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Editable
              </span>
            ) : (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                View Only
              </span>
            )}
          </div>
        )}
        
        <DocumentPreview 
          content={designContent}
          customStyles={customStyles}
          isEditable={isEditable}
          onContentChange={handleContentChange}
          onElementSelect={onElementSelect}
        />
      </div>
    </div>
  );
};
