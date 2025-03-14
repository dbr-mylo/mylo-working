
import { useState } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";
import type { EditorPanelProps } from "@/lib/types";
import { useWindowSize } from "@/hooks/useWindowSize";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export const EditorPanel = ({ content, onContentChange, isEditable }: EditorPanelProps) => {
  const { width } = useWindowSize();
  const isMobile = width < 1281;
  
  // Setup multi-page handling
  const [pages, setPages] = useState<string[]>([content || ""]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // Add a new blank page
  const handleAddPage = () => {
    const newPages = [...pages, ""];
    setPages(newPages);
    setCurrentPageIndex(newPages.length - 1);
  };
  
  // Navigate between pages
  const handlePageChange = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < pages.length) {
      // Save current page content first
      const updatedPages = [...pages];
      updatedPages[currentPageIndex] = content;
      setPages(updatedPages);
      
      // Move to the new page
      setCurrentPageIndex(newIndex);
      onContentChange(updatedPages[newIndex]);
    }
  };
  
  // Handle content updates on the current page
  const handleContentUpdate = (newContent: string) => {
    const updatedPages = [...pages];
    updatedPages[currentPageIndex] = newContent;
    setPages(updatedPages);
    onContentChange(newContent);
  };
  
  return (
    <div className={`${isMobile ? 'w-full' : 'w-1/2'} p-4 md:p-8 border-r border-editor-border bg-editor-bg ${!isMobile ? 'animate-slide-in' : ''} overflow-auto`}>
      <div className="mx-auto">
        {!isMobile && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-editor-text">Editor Panel</h2>
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
        <div className="bg-editor-bg p-4 rounded-md">
          <RichTextEditor 
            content={pages[currentPageIndex]} 
            onUpdate={handleContentUpdate}
            isEditable={isEditable}
            hideToolbar={!isEditable} // Hide toolbar if not editable
          />
        </div>
        
        {/* Page navigation */}
        {isEditable && (
          <div className="flex items-center justify-between mt-4 border-t pt-3 border-gray-200">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPageIndex - 1)}
                disabled={currentPageIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="flex items-center text-sm">
                Page {currentPageIndex + 1} of {pages.length}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPageIndex + 1)}
                disabled={currentPageIndex === pages.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddPage}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
