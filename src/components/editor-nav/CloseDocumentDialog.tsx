
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CloseDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => Promise<void>;
  onSaveAndClose: () => Promise<void>;
  isDesigner?: boolean;
}

export const CloseDocumentDialog = ({
  open,
  onOpenChange,
  onClose,
  onSaveAndClose,
  isDesigner = false
}: CloseDocumentDialogProps) => {
  const itemType = isDesigner ? "template" : "document";
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. Do you want to save before closing this {itemType}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClose} className="bg-destructive text-destructive-foreground">
            Discard Changes
          </AlertDialogAction>
          <AlertDialogAction onClick={onSaveAndClose}>
            Save & Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
