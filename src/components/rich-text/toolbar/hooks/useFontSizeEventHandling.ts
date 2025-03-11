
import { useCallback, useEffect } from 'react';
import { 
  FONT_SIZE_CHANGE_EVENT,
  FONT_SIZE_PARSED_EVENT
} from '../../font-size/constants';

interface FontSizeEventHandlerProps {
  onFontSizeChange: (fontSize: string) => void;
}

export const useFontSizeEventHandling = ({ onFontSizeChange }: FontSizeEventHandlerProps) => {
  // Function to update font size from events
  const handleFontSizeEvent = useCallback((event: CustomEvent) => {
    if (event.detail && event.detail.fontSize) {
      console.log(`EditorToolbar: Font size change event (${event.detail.source || 'unknown'})`, event.detail.fontSize);
      onFontSizeChange(event.detail.fontSize);
    }
  }, [onFontSizeChange]);
  
  // Listen for font size change events from the FontSize extension
  useEffect(() => {
    // Add event listeners with proper typing
    document.addEventListener(FONT_SIZE_CHANGE_EVENT, handleFontSizeEvent as EventListener);
    document.addEventListener(FONT_SIZE_PARSED_EVENT, handleFontSizeEvent as EventListener);
    
    return () => {
      // Clean up event listeners
      document.removeEventListener(FONT_SIZE_CHANGE_EVENT, handleFontSizeEvent as EventListener);
      document.removeEventListener(FONT_SIZE_PARSED_EVENT, handleFontSizeEvent as EventListener);
    };
  }, [handleFontSizeEvent]);
};
