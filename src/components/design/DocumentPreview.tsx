
import { RichTextEditor } from "@/components/RichTextEditor";
import { useState, useRef, useEffect } from "react";

interface DocumentPreviewProps {
  content: string;
  customStyles: string;
  isEditable: boolean;
  onContentChange?: (content: string) => void;
  onElementSelect?: (element: HTMLElement | null) => void;
}

export const DocumentPreview = ({ 
  content, 
  customStyles, 
  isEditable, 
  onContentChange,
  onElementSelect
}: DocumentPreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  
  const handleContentChange = (newContent: string) => {
    if (onContentChange) {
      onContentChange(newContent);
    }
  };
  
  const handlePreviewClick = (e: React.MouseEvent) => {
    if (!isEditable && onElementSelect) {
      let target = e.target as HTMLElement;
      
      if (target === previewRef.current) {
        setSelectedElement(null);
        if (onElementSelect) onElementSelect(null);
        return;
      }
      
      while (target && !['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'LI', 'BLOCKQUOTE'].includes(target.tagName)) {
        if (!target.parentElement || target.parentElement === previewRef.current) break;
        target = target.parentElement;
      }
      
      setSelectedElement(target);
      if (onElementSelect) onElementSelect(target);
      
      document.querySelectorAll('.text-element-selected').forEach(el => {
        el.classList.remove('text-element-selected');
      });
      
      if (target) {
        target.classList.add('text-element-selected');
      }
    }
  };
  
  useEffect(() => {
    return () => {
      document.querySelectorAll('.text-element-selected').forEach(el => {
        el.classList.remove('text-element-selected');
      });
    };
  }, []);
  
  return (
    <div className="bg-editor-panel p-4 rounded-md flex justify-center">
      <div className="prose prose-sm max-w-none">
        <style>
          {`
            .prose p {
              margin-top: 0;
              margin-bottom: 4px;
              line-height: 1.2;
            }
            .prose ul, .prose ol {
              margin-top: 0;
              margin-bottom: 0;
              padding-left: 20px;
            }
            .prose li {
              margin-bottom: 4px;
              line-height: 1.2;
            }
            .prose li p {
              margin: 0;
            }
            .prose ul ul, .prose ol ol, .prose ul ol, .prose ol ul {
              margin-top: 4px;
            }
            .prose li > ul, .prose li > ol {
              padding-left: 24px;
            }
            .text-element-selected {
              outline: 2px solid #6366f1;
              background-color: rgba(99, 102, 241, 0.1);
            }
            ${customStyles}
          `}
        </style>
        {isEditable ? (
          <RichTextEditor
            content={content}
            onUpdate={handleContentChange}
            isEditable={true}
            hideToolbar={false}
          />
        ) : content ? (
          <div 
            ref={previewRef} 
            onClick={handlePreviewClick}
            dangerouslySetInnerHTML={{ __html: content }} 
            className="min-h-[11in] w-[8.5in] p-[1in] mx-auto bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)] cursor-pointer" 
          />
        ) : (
          <p className="text-editor-text opacity-50">
            Content from the editor will appear here with brand styling
          </p>
        )}
      </div>
    </div>
  );
};
