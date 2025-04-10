
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
import { handleError } from "@/utils/errorHandling";
import { FileMenu } from "./FileMenu";

interface DocumentControlsProps {
  onSave: (() => Promise<void>) | undefined;
  onLoadDocument: ((doc: Document) => void) | undefined;
  documents: Document[];
  isLoadingDocs: boolean;
  content?: string;
  isSaving?: boolean;
  documentType?: string;
  currentRole?: string;
  currentDocument?: Document | null;
}

export const DocumentControls = ({
  onSave,
  onLoadDocument,
  documents,
  isLoadingDocs,
  content,
  isSaving = false,
  documentType = "document",
  currentRole = "editor",
  currentDocument = null
}: DocumentControlsProps) => {
  const { toast } = useToast();
  const { role } = useAuth();
  
  const isDesigner = role === "designer" || currentRole === "designer";
  const itemType = isDesigner ? "template" : "document";
  const buttonSize = isDesigner ? "xxs" : "sm";

  const handleLoadDocument = (doc: Document) => {
    try {
      if (onLoadDocument) {
        onLoadDocument(doc);
        toast({
          title: `${isDesigner ? "Template" : "Document"} loaded`,
          description: `"${doc.title}" has been loaded.`,
        });
      }
    } catch (error) {
      handleError(
        error,
        "DocumentControls.handleLoadDocument",
        `Failed to load ${itemType}. Please try again.`
      );
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
    
    try {
      if (onSave) {
        await onSave();
        toast({
          title: `${itemType} saved`,
          description: `Your ${itemType} has been saved successfully.`,
        });
      }
    } catch (error) {
      handleError(
        error,
        "DocumentControls.handleSave",
        `There was a problem saving your ${itemType}. Please try again.`
      );
    }
  };

  // Create current document object from content
  const documentObj = currentDocument || (content ? {
    id: "",
    title: documentType === "template" ? "My Template" : "My Document",
    content: content,
    updated_at: new Date().toISOString()
  } : null);

  return (
    <>
      {/* File Menu for import/export operations */}
      <FileMenu
        currentDocument={documentObj}
        documentType={documentType}
        currentRole={currentRole}
        onImport={handleLoadDocument}
        content={content || ""}
        documentHistory={documents}
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="default" 
            size={buttonSize} 
            className="flex items-center gap-2 rounded-[7.5px] h-[40px]"
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
        variant="default" 
        size={buttonSize} 
        className="flex items-center gap-2 rounded-[7.5px] h-[40px]"
        onClick={handleSave}
        disabled={isSaving}
      >
        <Save className="w-4 h-4" />
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </>
  );
};
