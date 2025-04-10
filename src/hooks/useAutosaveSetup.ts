
import { useCallback, useEffect } from "react";
import { useAutosave, SaveStatus } from "./useAutosave";
import { useOnline } from "./useOnline";

interface UseAutosaveSetupProps {
  content: string;
  initialContent: string;
  documentTitle: string;
  onSave?: () => Promise<void>;
  debounceTime?: number;
  enabled?: boolean;
}

export function useAutosaveSetup({
  content,
  initialContent,
  documentTitle,
  onSave,
  debounceTime = 2000,
  enabled = true
}: UseAutosaveSetupProps) {
  const isOnline = useOnline();
  
  // Wrap onSave to handle cases where it's undefined
  const handleSave = useCallback(async () => {
    if (onSave) {
      return onSave();
    }
    return Promise.resolve();
  }, [onSave]);
  
  const {
    saveStatus: baseStatus,
    lastSaved,
    triggerSave,
    isSaving
  } = useAutosave({
    content,
    initialContent,
    documentTitle,
    onSave: handleSave,
    debounceTime,
    enabled: enabled && onSave !== undefined
  });
  
  // Override status with offline when not online
  const saveStatus: SaveStatus = !isOnline ? 'offline' : baseStatus;
  
  // Attempt to save when coming back online
  useEffect(() => {
    if (isOnline && baseStatus === 'error') {
      triggerSave();
    }
  }, [isOnline, baseStatus, triggerSave]);
  
  return {
    saveStatus,
    lastSaved,
    triggerSave,
    isSaving
  };
}
