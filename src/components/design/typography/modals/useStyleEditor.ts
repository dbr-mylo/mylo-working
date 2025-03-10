
import { useState } from "react";
import { StyleFormData, TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";

interface UseStyleEditorProps {
  initialStyle: TextStyle | null;
  onStyleSaved: () => void;
  onClose: () => void;
}

export const useStyleEditor = ({
  initialStyle,
  onStyleSaved,
  onClose
}: UseStyleEditorProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSave = async (formData: StyleFormData) => {
    try {
      setIsSubmitting(true);
      
      const styleData = {
        ...formData,
        id: initialStyle?.id, // If editing, keep the existing ID
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
      setIsSubmitting(false);
    }
  };

  return {
    handleSave,
    isSubmitting
  };
};
