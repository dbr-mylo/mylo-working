
import { Button } from "@/components/ui/button";
import { Save, FolderOpen } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Document } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentControlsProps {
  onSave: (() => Promise<void>) | undefined;
  onLoadDocument: ((doc: Document) => void) | undefined;
  documents: Document[];
  isLoadingDocs: boolean;
  content?: string;
}

export const DocumentControls = ({
  onSave,
  onLoadDocument,
  documents,
  isLoadingDocs,
  content
}: DocumentControlsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleLoadDocument = (doc: Document) => {
    console.log("Loading document from DocumentControls:", doc.id);
    console.log("Document title:", doc.title);
    console.log("Content length:", doc.content ? doc.content.length : 0);
    
    if (onLoadDocument) {
      onLoadDocument(doc);
      toast({
        title: "Document loaded",
        description: `"${doc.title}" has been loaded.`,
      });
    }
  };

  const handleSave = async () => {
    if (!content || !content.trim()) {
      toast({
        title: "Cannot save empty document",
        description: "Please add some content to your document.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave();
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast({
        title: "Error saving document",
        description: "There was a problem saving your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            disabled={isLoadingDocs}
          >
            <FolderOpen className="w-4 h-4" />
            {isLoadingDocs ? "Loading..." : "Open"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
          {documents.length === 0 ? (
            <DropdownMenuItem disabled>No documents found</DropdownMenuItem>
          ) : (
            documents.map((doc) => (
              <DropdownMenuItem 
                key={doc.id} 
                onClick={() => handleLoadDocument(doc)}
                className="flex flex-col items-start"
              >
                <span className="font-medium">{doc.title}</span>
                <span className="text-xs opacity-70">
                  {new Date(doc.updated_at).toLocaleString()}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={handleSave}
        disabled={isSaving}
      >
        <Save className="w-4 h-4" />
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </>
  );
};
