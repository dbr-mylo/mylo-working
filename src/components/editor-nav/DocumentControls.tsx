
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
import { useAuth } from "@/contexts/AuthContext";

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
  const { role } = useAuth();
  
  const isDesigner = role === "designer";
  const itemType = isDesigner ? "template" : "document";
  const buttonSize = isDesigner ? "xs" : "sm";

  const handleLoadDocument = (doc: Document) => {
    if (onLoadDocument) {
      onLoadDocument(doc);
      toast({
        title: `${isDesigner ? "Template" : "Document"} loaded`,
        description: `"${doc.title}" has been loaded.`,
      });
    }
  };

  const handleSave = async () => {
    if (!content || !content.trim()) {
      toast({
        title: `Cannot save empty ${itemType}`,
        description: `Please add some content to your ${itemType}.`,
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
        title: `Error saving ${itemType}`,
        description: `There was a problem saving your ${itemType}. Please try again.`,
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
            size={buttonSize} 
            className="flex items-center gap-2"
            disabled={isLoadingDocs}
          >
            <FolderOpen className="w-4 h-4" />
            {isLoadingDocs ? "Loading..." : "Open"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
          {documents.length === 0 ? (
            <DropdownMenuItem disabled>No {isDesigner ? "templates" : "documents"} found</DropdownMenuItem>
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
        size={buttonSize} 
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
