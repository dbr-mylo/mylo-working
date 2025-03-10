
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StyleForm } from "../StyleForm";
import { StyleFormData, TextStyle } from "@/lib/types";

interface StyleEditorDialogContentProps {
  style: TextStyle | null;
  onSave: (formData: StyleFormData) => Promise<void>;
  onClose: () => void;
}

export const StyleEditorDialogContent = ({
  style,
  onSave,
  onClose,
}: StyleEditorDialogContentProps) => {
  return (
    <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
      <DialogHeader className="p-3 pb-2">
        <DialogTitle className="text-sm font-semibold">
          {style ? `Edit Style: ${style.name}` : "Create New Style"}
        </DialogTitle>
      </DialogHeader>
      
      <div className="px-3 pb-3">
        <StyleForm 
          initialValues={style || undefined}
          onSubmit={onSave}
        />
      </div>
    </DialogContent>
  );
};
