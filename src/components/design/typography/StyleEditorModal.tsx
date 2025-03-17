
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StyleForm } from "./StyleForm";
import { TextStyle, StyleFormData } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";

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
  
  const handleSave = async (formData: StyleFormData) => {
    try {
      // Ensure we have values for required fields
      const styleData = {
        ...formData,
        name: formData.name || "New Style",
        selector: formData.selector || "p",
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

  // Default values for a new style if none is provided
  const defaultStyle: TextStyle = {
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xs p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-2 pb-2">
          <DialogTitle className="text-xs font-semibold">
            {style ? `Edit Style: ${style.name}` : "Create New Style"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-2 pb-2">
          <StyleForm 
            initialValues={style || defaultStyle}
            onSubmit={handleSave}
            compact={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
