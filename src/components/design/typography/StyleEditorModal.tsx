
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StyleForm } from "./StyleForm";
import { TextStyle, StyleFormData } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

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
  const [localStyle, setLocalStyle] = useState<TextStyle | null>(null);
  
  // Update local style when prop changes
  useEffect(() => {
    if (style) {
      setLocalStyle(style);
    } else if (isOpen) {
      // Set default values for a new style
      setLocalStyle({
        id: '',
        name: 'New Style',
        fontFamily: 'Inter',
        fontSize: '16px',
        fontWeight: '400',
        color: '#000000',
        lineHeight: '1.5',
        letterSpacing: '0',
        selector: 'p',
        description: ''
      });
    }
  }, [style, isOpen]);
  
  const handleSave = async (formData: StyleFormData) => {
    try {
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
      console.error("Error saving style:", error);
      toast({
        title: "Error",
        description: "Failed to save text style",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {style ? `Edit Style: ${style.name}` : "Create New Style"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {localStyle && (
            <StyleForm 
              initialValues={localStyle}
              onSubmit={handleSave}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
