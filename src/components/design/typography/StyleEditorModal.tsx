
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {style ? `Edit Style: ${style.name}` : "Create New Style"}
          </DialogTitle>
        </DialogHeader>
        <StyleForm 
          initialValues={style || undefined}
          onSubmit={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
};
