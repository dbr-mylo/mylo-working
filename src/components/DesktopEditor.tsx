
import { useState, useEffect } from "react";
import { EditorPanel } from "@/components/EditorPanel";
import { DesignPanel } from "@/components/DesignPanel";
import { useToast } from "@/hooks/use-toast";

type DesktopEditorProps = {
  content: string;
  onContentChange: (content: string) => void;
  isEditorEditable: boolean;
  isDesignEditable: boolean;
  templateId?: string;
};

export const DesktopEditor = ({ 
  content, 
  onContentChange, 
  isEditorEditable, 
  isDesignEditable,
  templateId
}: DesktopEditorProps) => {
  // State for multi-page functionality
  const [pages, setPages] = useState<string[]>([content || ""]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // Update the content when the user edits the current page
  const handleContentUpdate = (newContent: string) => {
    // Update the content in the pages array
    const updatedPages = [...pages];
    updatedPages[currentPageIndex] = newContent;
    setPages(updatedPages);
    
    // Call the parent's onContentChange with the current page content
    onContentChange(newContent);
  };
  
  // Update pages array when content prop changes (e.g., when loading a document)
  useEffect(() => {
    if (content && pages.length === 1 && pages[0] === "") {
      setPages([content]);
    }
  }, [content]);
  
  return (
    <main className="flex min-h-[calc(100vh-4rem)] animate-fade-in">
      <EditorPanel 
        content={pages[currentPageIndex]}
        onContentChange={handleContentUpdate}
        isEditable={isEditorEditable}
      />
      <DesignPanel 
        content={pages[currentPageIndex]}
        isEditable={isDesignEditable}
        templateId={templateId}
        multiPageContent={pages}
        currentPageIndex={currentPageIndex}
      />
    </main>
  );
};
