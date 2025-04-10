import { useEffect, useState, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Document } from "@/lib/types";
import { useOnline } from "./useOnline";
import { handleError } from "@/utils/errorHandling";
import { withRetry } from "@/utils/error/withRetry";

export interface AutosaveOptions {
  content: string;
  initialContent: string;
  documentTitle: string;
  onSave: () => Promise<void>;
  debounceTime?: number;
  enabled?: boolean;
  maxRetries?: number;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline' | 'retry';

export interface UseAutosaveReturn {
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  triggerSave: () => Promise<void>;
  isSaving: boolean;
  pendingChanges: boolean;
  setSaveInterval: (interval: number) => void;
}

export function useAutosave({
  content,
  initialContent,
  documentTitle,
  onSave,
  debounceTime = 2000,
  enabled = true,
  maxRetries = 3
}: AutosaveOptions): UseAutosaveReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);
  const [saveInterval, setSaveInterval] = useState(debounceTime);
  
  const { toast } = useToast();
  const isOnline = useOnline();
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);
  const contentRef = useRef(content);
  const initialContentRef = useRef(initialContent);
  const lastSavedContentRef = useRef(initialContent);
  const lastErrorRef = useRef<Error | null>(null);
  
  // Read user preferences for autosave settings
  useEffect(() => {
    const userInterval = localStorage.getItem('mylo-autosave-interval');
    const userEnabled = localStorage.getItem('mylo-autosave-enabled');
    
    if (userInterval) {
      setSaveInterval(parseInt(userInterval, 10));
    }
    
    // Listen for changes in local storage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mylo-autosave-interval' && e.newValue) {
        setSaveInterval(parseInt(e.newValue, 10));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Keep refs updated
  useEffect(() => {
    contentRef.current = content;
  }, [content]);
  
  useEffect(() => {
    initialContentRef.current = initialContent;
  }, [initialContent]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  // Reset retry count when going online
  useEffect(() => {
    if (isOnline && saveStatus === 'offline') {
      retryCountRef.current = 0;
      setPendingChanges(hasChanges());
    }
  }, [isOnline, saveStatus]);
  
  // Determine if there are changes to save
  const hasChanges = useCallback(() => {
    return contentRef.current !== initialContentRef.current && 
           contentRef.current !== lastSavedContentRef.current &&
           contentRef.current.trim() !== '';
  }, []);

  // Enhanced save function with retry logic
  const triggerSave = useCallback(async () => {
    if (!hasChanges() || !enabled || !isOnline) {
      if (!isOnline) {
        setSaveStatus('offline');
        setPendingChanges(true);
      }
      return;
    }
    
    try {
      setIsSaving(true);
      setSaveStatus('saving');
      
      // Capture content before save so we can compare after
      const contentBeforeSave = contentRef.current;
      
      // Use retry wrapper around onSave
      const saveWithRetry = withRetry(onSave, {
        maxAttempts: maxRetries,
        delayMs: 1000,
        retryCondition: (error) => {
          // Only retry network errors or specific API errors
          if (error instanceof Error) {
            lastErrorRef.current = error;
            return error.message.includes('network') || 
                  error.message.includes('timeout') ||
                  error.message.includes('connection');
          }
          return false;
        },
        onRetry: (attempt) => {
          retryCountRef.current = attempt;
          setSaveStatus('retry');
          console.log(`Retry attempt ${attempt} for document "${documentTitle}"`);
        }
      });
      
      // Execute save with retry
      await saveWithRetry();
      
      // Success handling
      lastSavedContentRef.current = contentBeforeSave;
      setSaveStatus('saved');
      setLastSaved(new Date());
      setPendingChanges(false);
      retryCountRef.current = 0;
      
      console.log(`Document "${documentTitle}" autosaved at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error('Error during autosave:', error);
      setSaveStatus('error');
      setPendingChanges(true);
      
      handleError(
        error,
        "useAutosave.triggerSave",
        "Could not save changes automatically. Your changes will be preserved.",
        false // Don't show toast for every autosave error
      );
      
      // Show toast only for persistent errors
      if (retryCountRef.current >= maxRetries) {
        toast({
          title: 'Autosave failed after multiple attempts',
          description: 'Changes will be preserved and we\'ll try again later.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSaving(false);
    }
  }, [onSave, hasChanges, enabled, isOnline, documentTitle, toast, maxRetries]);

  // Adaptive autosave effect
  useEffect(() => {
    // Skip if autosave is disabled or we're offline
    if (!enabled || !isOnline) {
      if (!isOnline && hasChanges()) {
        setSaveStatus('offline');
        setPendingChanges(true);
      }
      return;
    }
    
    // Check if there are changes that should trigger autosave
    if (hasChanges()) {
      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Adapt timing based on error state
      let adaptiveDelay = saveInterval;
      if (saveStatus === 'error') {
        // Exponential backoff for errors
        adaptiveDelay = Math.min(saveInterval * Math.pow(2, retryCountRef.current), 30000);
      }
      
      console.log('Changes detected, scheduling autosave in', adaptiveDelay, 'ms');
      setPendingChanges(true);
      
      timerRef.current = setTimeout(() => {
        triggerSave();
      }, adaptiveDelay);
    }
  }, [content, enabled, isOnline, hasChanges, triggerSave, saveStatus, saveInterval]);

  // Try to save when coming back online
  useEffect(() => {
    if (isOnline && pendingChanges && !isSaving && saveStatus === 'offline') {
      console.log('Back online, triggering save for pending changes');
      triggerSave();
    }
  }, [isOnline, pendingChanges, isSaving, saveStatus, triggerSave]);

  return {
    saveStatus,
    lastSaved,
    triggerSave,
    isSaving,
    pendingChanges,
    setSaveInterval
  };
}
