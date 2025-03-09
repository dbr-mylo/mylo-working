
import { TextStyle, StyleFormData } from "@/lib/types";

interface UseStyleFormSubmitProps {
  initialValues?: TextStyle;
  onSubmit?: (data: StyleFormData) => void;
}

export const useStyleFormSubmit = ({ initialValues, onSubmit }: UseStyleFormSubmitProps) => {
  const handleSubmit = (e: React.FormEvent, formData: StyleFormData) => {
    if (!onSubmit) return;
    
    e.preventDefault();
    onSubmit(formData);
  };

  // Determine if we're in a controlled mode (with onSubmit)
  const showFormFields = !!onSubmit;
  
  // Prepare cancel handler that submits without validation
  const handleCancel = () => {
    if (!onSubmit) return;
    
    onSubmit({
      name: initialValues?.name || "",
      selector: "",
      description: "",
      parentId: initialValues?.parentId,
      fontFamily: initialValues?.fontFamily || "Inter",
      fontSize: initialValues?.fontSize || "16px",
      fontWeight: initialValues?.fontWeight || "400",
      color: initialValues?.color || "#000000",
      lineHeight: initialValues?.lineHeight || "1.5",
      letterSpacing: initialValues?.letterSpacing || "0px",
      textAlign: initialValues?.textAlign || "left",
    });
  };

  return {
    handleSubmit,
    handleCancel,
    showFormFields,
    isUpdate: !!initialValues?.id
  };
};
