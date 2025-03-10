
import { Dialog } from "@/components/ui/dialog";
import { TextStyle } from "@/lib/types";
import { StyleEditorDialogContent } from "./modals/StyleEditorDialogContent";
import { useStyleEditor } from "./modals/useStyleEditor";

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
  const { handleSave } = useStyleEditor({
    initialStyle: style,
    onStyleSaved,
    onClose
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <StyleEditorDialogContent
        style={style}
        onSave={handleSave}
        onClose={onClose}
      />
    </Dialog>
  );
};
