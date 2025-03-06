
import { useEffect, useRef } from 'react';

interface UseAutoSaveProps {
  content: string;
  initialContent: string;
  documentTitle: string;
  saveDocument: () => Promise<void>;
  isEnabled?: boolean;
  interval?: number;
}

export function useAutoSave({
  content,
  initialContent,
  documentTitle,
  saveDocument,
  isEnabled = true,
  interval = 30000 // Default to 30 seconds
}: UseAutoSaveProps) {
  const timerRef = useRef<number | null>(null);
  const lastSavedContentRef = useRef<string>(initialContent);
  const lastSavedTitleRef = useRef<string>(documentTitle);
  
  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  // Update refs when a save occurs elsewhere (like from manual save or title change)
  useEffect(() => {
    lastSavedContentRef.current = content;
    lastSavedTitleRef.current = documentTitle;
  }, [initialContent, documentTitle]);
  
  // Set up auto-save
  useEffect(() => {
    if (!isEnabled) return;
    
    const hasContentChanged = content !== lastSavedContentRef.current;
    const hasTitleChanged = documentTitle !== lastSavedTitleRef.current;
    
    // If there are changes, schedule an auto-save
    if (hasContentChanged || hasTitleChanged) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      
      timerRef.current = window.setTimeout(async () => {
        console.log('Auto-saving document...');
        
        try {
          await saveDocument();
          lastSavedContentRef.current = content;
          lastSavedTitleRef.current = documentTitle;
          console.log('Auto-save completed successfully');
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, interval);
    }
  }, [content, documentTitle, initialContent, saveDocument, isEnabled, interval]);
}
