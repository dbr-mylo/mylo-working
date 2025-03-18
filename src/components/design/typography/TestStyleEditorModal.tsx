
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StyleForm } from "./StyleForm";
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

export const TestStyleEditorModal = ({
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
      // Check for duplicate names
      const existingStyles = await textStyleStore.getTextStyles();
      const isDuplicate = existingStyles.some(
        existingStyle => 
          existingStyle.name.toLowerCase() === formData.name.toLowerCase() && 
          existingStyle.id !== style?.id
      );
      
      if (isDuplicate) {
        toast({
          title: "Duplicate style name",
          description: "A style with this name already exists. Please use a different name.",
          variant: "destructive",
        });
        return;
      }
      
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
    // Only allow cancel if not in the middle of saving
    if (!isSaving) {
      onClose();
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Only allow closing via onOpenChange if not saving
        if (!open && !isSaving) {
          onClose();
        }
      }}
    >
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
