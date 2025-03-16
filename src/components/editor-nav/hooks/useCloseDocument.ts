
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hasUnsavedChanges } from "../EditorNavUtils";

interface UseCloseDocumentProps {
  content?: string;
  initialContent?: string;
  title: string;
  documentTitle: string;
  onSave?: () => Promise<void>;
}

export const useCloseDocument = ({
  content,
  initialContent,
  title,
  documentTitle,
  onSave
}: UseCloseDocumentProps) => {
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const navigate = useNavigate();
  
  const handleCloseDocument = async (): Promise<void> => {
    console.log("Close document triggered. Content length:", content?.length);
    console.log("Initial content length:", initialContent?.length);
    
    if (hasUnsavedChanges(content, initialContent, title, documentTitle)) {
      console.log("Unsaved changes detected, showing dialog");
      setShowCloseDialog(true);
    } else {
      console.log("No unsaved changes, navigating to document list");
      await navigateToDocumentList();
    }
    return Promise.resolve();
  };

  const navigateToDocumentList = async (): Promise<void> => {
    navigate('/');
    return Promise.resolve();
  };

  const handleCloseWithoutSaving = async (): Promise<void> => {
    console.log("Closing without saving");
    setShowCloseDialog(false);
    await navigateToDocumentList();
    return Promise.resolve();
  };

  const handleSaveAndClose = async (): Promise<void> => {
    console.log("Saving and closing");
    setShowCloseDialog(false);
    
    if (onSave) {
      console.log("Calling onSave");
      await onSave();
      console.log("Save completed");
    }
    
    console.log("Navigating away");
    await navigateToDocumentList();
    return Promise.resolve();
  };

  return {
    showCloseDialog,
    setShowCloseDialog,
    handleCloseDocument,
    handleCloseWithoutSaving,
    handleSaveAndClose
  };
};
