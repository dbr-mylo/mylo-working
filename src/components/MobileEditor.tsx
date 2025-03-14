
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorPanel } from "@/components/EditorPanel";
import { DesignPanel } from "@/components/DesignPanel";

type MobileEditorProps = {
  content: string;
  onContentChange: (content: string) => void;
  isEditorEditable: boolean;
  isDesignEditable: boolean;
  templateId?: string;
};

export const MobileEditor = ({ 
  content, 
  onContentChange, 
  isEditorEditable, 
  isDesignEditable,
  templateId
}: MobileEditorProps) => {
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
    <main className="animate-fade-in p-4">
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="design">Design Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="mt-0">
          <EditorPanel 
            content={pages[currentPageIndex]}
            onContentChange={handleContentUpdate}
            isEditable={isEditorEditable}
          />
        </TabsContent>
        <TabsContent value="design" className="mt-0">
          <DesignPanel 
            content={pages[currentPageIndex]}
            isEditable={isDesignEditable}
            templateId={templateId}
            multiPageContent={pages}
            currentPageIndex={currentPageIndex}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
};
