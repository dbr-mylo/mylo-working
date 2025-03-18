
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StyleForm } from "@/components/design/typography/StyleForm";
import { TextStyle, StyleFormData } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";
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
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async (formData: StyleFormData) => {
    // Validate required fields
    if (!formData.name?.trim()) {
      toast({
        title: "Required field missing",
        description: "Style name is required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      const styleData = {
        ...formData,
        id: style?.id, // If editing, keep the existing ID
        // Ensure no empty strings for optional fields
        selector: formData.selector || "p",
        description: formData.description || "",
      };
      
      await textStyleStore.saveTextStyle(styleData);
      
      toast({
        title: "Style saved",
        description: "Text style has been saved successfully",
      });
      
      onStyleSaved();
      onClose();
    } catch (error) {
      console.error("Error saving style:", error);
      toast({
        title: "Error",
        description: "Failed to save text style",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Simply close the modal without saving
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isSaving) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-3 pb-2">
          <DialogTitle className="text-sm font-semibold">
            {style ? `Edit Style: ${style.name}` : "Create New Style"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-3 pb-3">
          <StyleForm 
            initialValues={style || undefined}
            onSubmit={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
