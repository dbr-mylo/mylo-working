
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StyleForm } from "./StyleForm";
import { TextStyle, StyleFormData } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useStyleNameValidator } from "./hooks/useStyleNameValidator";

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
  const [styleName, setStyleName] = useState(style?.name || "");
  
  const { isDuplicate, isChecking, isValid } = useStyleNameValidator({
    name: styleName,
    currentStyleId: style?.id
  });
  
  // Update the name state when style prop changes
  useEffect(() => {
    if (style) {
      setStyleName(style.name || "");
    } else {
      setStyleName("");
    }
  }, [style]);
  
  const handleSave = async (formData: StyleFormData) => {
    if (!formData.name?.trim()) {
      toast({
        title: "Required field missing",
        description: "Style name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (isDuplicate) {
      toast({
        title: "Duplicate style name",
        description: "A style with this name already exists. Please use a different name.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      const styleData = {
        ...formData,
        id: style?.id,
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
    if (!isSaving) {
      onClose();
    }
  };

  const handleNameChange = (name: string) => {
    setStyleName(name);
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
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
            onNameChange={handleNameChange}
            nameValidation={{
              isValid,
              isDuplicate,
              isChecking
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
