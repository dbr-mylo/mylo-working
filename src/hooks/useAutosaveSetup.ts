
import { useCallback, useEffect, useState } from "react";
import { useAutosave, SaveStatus } from "./useAutosave";
import { useOnline } from "./useOnline";
import { useLocalStorage } from "./useLocalStorage";

interface UseAutosaveSetupProps {
  content: string;
  initialContent: string;
  documentTitle: string;
  onSave?: () => Promise<void>;
  debounceTime?: number;
  enabled?: boolean;
  maxRetries?: number;
}

export function useAutosaveSetup({
  content,
  initialContent,
  documentTitle,
  onSave,
  debounceTime = 2000,
  enabled = true,
  maxRetries = 3
}: UseAutosaveSetupProps) {
  const isOnline = useOnline();
  const [userEnabled, setUserEnabled] = useLocalStorage('mylo-autosave-enabled', 'true');
  const [userInterval, setUserInterval] = useLocalStorage('mylo-autosave-interval', debounceTime.toString());
  
  // Calculate effective debounce time from user settings
  const effectiveDebounceTime = parseInt(userInterval, 10) || debounceTime;
  
  // Calculate effective enabled state from user settings
  const effectiveEnabled = enabled && userEnabled !== 'false';
  
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
    isSaving,
    pendingChanges,
    setSaveInterval
  } = useAutosave({
    content,
    initialContent,
    documentTitle,
    onSave: handleSave,
    debounceTime: effectiveDebounceTime,
    enabled: effectiveEnabled && onSave !== undefined,
    maxRetries
  });
  
  // Override status with offline when not online
  const saveStatus: SaveStatus = !isOnline ? 'offline' : baseStatus;
  
  // Update interval if user preference changes
  useEffect(() => {
    setSaveInterval(effectiveDebounceTime);
  }, [effectiveDebounceTime, setSaveInterval]);
  
  // Attempt to save when coming back online
  useEffect(() => {
    if (isOnline && baseStatus === 'error' && pendingChanges) {
      triggerSave();
    }
  }, [isOnline, baseStatus, pendingChanges, triggerSave]);
  
  // Version tracking
  const [documentVersions, setDocumentVersions] = useState<Array<{
    content: string;
    timestamp: Date;
  }>>([]);
  
  // Add version on successful save
  useEffect(() => {
    if (baseStatus === 'saved' && lastSaved) {
      setDocumentVersions(prev => [
        ...prev,
        { content, timestamp: lastSaved }
      ].slice(-10)); // Keep only the last 10 versions
    }
  }, [baseStatus, lastSaved, content]);
  
  return {
    saveStatus,
    lastSaved,
    triggerSave,
    isSaving,
    pendingChanges,
    documentVersions,
    isAutosaveEnabled: effectiveEnabled,
    setAutosaveEnabled: (enabled: boolean) => 
      setUserEnabled(enabled ? 'true' : 'false'),
    autosaveInterval: effectiveDebounceTime,
    setAutosaveInterval: (interval: number) =>
      setUserInterval(interval.toString())
  };
}
