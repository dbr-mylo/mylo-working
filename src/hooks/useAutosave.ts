import { useEffect, useState, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Document } from "@/lib/types";

export interface AutosaveOptions {
  content: string;
  initialContent: string;
  documentTitle: string;
  onSave: () => Promise<void>;
  debounceTime?: number;
  enabled?: boolean;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline';

export interface UseAutosaveReturn {
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  triggerSave: () => Promise<void>;
  isSaving: boolean;
}

export function useAutosave({
  content,
  initialContent,
  documentTitle,
  onSave,
  debounceTime = 2000,
  enabled = true
}: AutosaveOptions): UseAutosaveReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef(content);
  const initialContentRef = useRef(initialContent);
  
  // Keep content ref updated
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
  
  // Determine if there are changes to save
  const hasChanges = useCallback(() => {
    return contentRef.current !== initialContentRef.current && 
           contentRef.current.trim() !== '';
  }, []);

  // Save function
  const triggerSave = useCallback(async () => {
    if (!hasChanges() || !enabled) {
      return;
    }
    
    try {
      setIsSaving(true);
      setSaveStatus('saving');
      await onSave();
      setSaveStatus('saved');
      setLastSaved(new Date());
      console.log(`Document "${documentTitle}" autosaved at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error('Error during autosave:', error);
      setSaveStatus('error');
      toast({
        title: 'Autosave failed',
        description: 'Could not save changes automatically.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [onSave, hasChanges, enabled, documentTitle, toast]);

  // Debounced autosave effect
  useEffect(() => {
    if (!enabled) return;
    
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Only trigger autosave if there are actual changes
    if (hasChanges()) {
      console.log('Changes detected, scheduling autosave...');
      timerRef.current = setTimeout(() => {
        triggerSave();
      }, debounceTime);
    }
  }, [content, enabled, debounceTime, triggerSave, hasChanges]);

  return {
    saveStatus,
    lastSaved,
    triggerSave,
    isSaving
  };
}
