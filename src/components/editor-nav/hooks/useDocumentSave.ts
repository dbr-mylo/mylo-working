
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseDocumentSaveProps {
  onSave?: () => Promise<void>;
  loadDocuments?: () => Promise<void>;
  content?: string;
  documentType: string;
}

export const useDocumentSave = ({
  onSave, 
  loadDocuments,
  content,
  documentType
}: UseDocumentSaveProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (): Promise<void> => {
    if (!content || !content.trim()) {
      toast({
        title: `Cannot save empty ${documentType}`,
        description: `Please add some content to your ${documentType}.`,
        variant: "destructive",
      });
      return Promise.resolve();
    }
    
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave();
      }
      
      if (loadDocuments) {
        await loadDocuments();
      }
    } catch (error) {
      console.error(`Error saving ${documentType}:`, error);
      toast({
        title: `Error saving ${documentType}`,
        description: `There was a problem saving your ${documentType}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
    return Promise.resolve();
  };

  return {
    isSaving,
    handleSave
  };
};
