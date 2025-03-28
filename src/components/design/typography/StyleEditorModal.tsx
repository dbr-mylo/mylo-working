
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StyleForm } from "./StyleForm";
import { TextStyle, StyleFormData } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";
import { handleError } from "@/utils/errorHandling";
import { ErrorDisplay } from "@/components/errors/ErrorDisplay";
import { useState } from "react";

interface StyleEditorModalProps {
  style: TextStyle | null;
  isOpen: boolean;
  onClose: () => void;
  onStyleSaved: () => void;
}

export const StyleEditorModal = ({
  style,
  isOpen,
  onClose,
  onStyleSaved,
}: StyleEditorModalProps) => {
  const { toast } = useToast();
  const [error, setError] = useState<unknown>(null);
  
  const handleSave = async (formData: StyleFormData) => {
    try {
      // Reset any previous errors
      setError(null);
      
      const styleData = {
        ...formData,
        id: style?.id, // If editing, keep the existing ID
      };
      
      await textStyleStore.saveTextStyle(styleData);
      
      toast({
        title: "Style saved",
        description: "Text style has been saved successfully",
      });
      
      onStyleSaved();
      onClose();
    } catch (error) {
      setError(error);
      handleError(
        error, 
        "StyleEditorModal.handleSave", 
        "Failed to save text style"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-3 pb-2">
          <DialogTitle className="text-sm font-semibold">
            {style ? `Edit Style: ${style.name}` : "Create New Style"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-3 pb-3">
          {error && (
            <ErrorDisplay 
              error={error} 
              context="StyleEditorModal" 
              className="mb-4"
            />
          )}
          
          <StyleForm 
            initialValues={style || undefined}
            onSubmit={handleSave}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
