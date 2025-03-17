
import { Button } from "@/components/ui/button";
import { Save, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Document } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentControlsProps {
  onSave: () => Promise<void>;
  isSaving: boolean;
  onLoadDocument: ((doc: Document) => void) | undefined;
  documents: Document[];
  isLoadingDocs: boolean;
  documentType: string;
  currentRole: string;
}

export const DocumentControls = ({
  onSave,
  isSaving,
  onLoadDocument,
  documents,
  isLoadingDocs,
  documentType,
  currentRole
}: DocumentControlsProps) => {
  const { toast } = useToast();
  
  // Remove the different button sizes based on role - use a consistent size
  const handleLoadDocument = (doc: Document) => {
    if (onLoadDocument) {
      onLoadDocument(doc);
      toast({
        title: `${currentRole === "designer" ? "Template" : "Document"} loaded`,
        description: `"${doc.title}" has been loaded.`,
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="default" 
            size="sm" 
            className="flex items-center gap-2 rounded-[7.5px] h-[40px]"
            disabled={isLoadingDocs}
          >
            <FolderOpen className="w-4 h-4" />
            {isLoadingDocs ? "Loading..." : "Open"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
          {documents.length === 0 ? (
            <DropdownMenuItem disabled>No {currentRole === "designer" ? "templates" : "documents"} found</DropdownMenuItem>
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
        size="sm" 
        className="flex items-center gap-2 rounded-[7.5px] h-[40px]"
        onClick={onSave}
        disabled={isSaving}
      >
        <Save className="w-4 h-4" />
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </>
  );
};
