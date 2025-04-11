
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { handleError } from "@/utils/error/handleError";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

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
  const { isEnabled } = useFeatureFlags();

  const handleSave = async (): Promise<void> => {
    // Use feature flags to check if save is enabled
    if (!isEnabled('document-save')) {
      toast({
        title: "Saving temporarily disabled",
        description: "Document saving is currently unavailable. Using local backup instead.",
        variant: "warning",
      });
      
      // Save to local backup instead as fallback
      try {
        localStorage.setItem(`${documentType}_backup_${Date.now()}`, content || '');
        toast({
          title: "Local backup created",
          description: "Your changes have been saved to a local backup.",
        });
      } catch (error) {
        handleError(
          error, 
          `useDocumentSave.localBackup(${documentType})`,
          "Failed to create local backup. Please copy your content manually."
        );
      }
      
      return Promise.resolve();
    }
  
    if (!content || !content.trim()) {
      toast({
        title: `Cannot save empty ${documentType}`,
        description: `Please add some content to your ${documentType}.`,
        variant: "destructive",
      });
      return Promise.resolve();
    }
    
    console.log(`Starting save process for ${documentType}. Content length: ${content.length}`);
    setIsSaving(true);
    
    try {
      if (onSave) {
        console.log(`Calling onSave function for ${documentType}`);
        await onSave();
        console.log(`onSave function completed for ${documentType}`);
        
        toast({
          title: `${documentType} saved`,
          description: `Your ${documentType} has been saved successfully.`,
        });
      }
      
      if (loadDocuments) {
        console.log(`Reloading documents list for ${documentType}`);
        await loadDocuments();
        console.log(`Documents list reloaded for ${documentType}`);
      }
    } catch (error) {
      handleError(
        error, 
        `useDocumentSave.handleSave(${documentType})`,
        `There was a problem saving your ${documentType}. Please try again.`
      );
    } finally {
      setIsSaving(false);
      console.log(`Save process completed for ${documentType}`);
    }
    return Promise.resolve();
  };

  return {
    isSaving,
    handleSave
  };
};
