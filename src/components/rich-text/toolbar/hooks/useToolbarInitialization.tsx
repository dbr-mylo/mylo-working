
import { useEffect } from 'react';
import { CLEAR_FONT_CACHE_EVENT } from '../../font-size/constants';

export const useToolbarInitialization = () => {
  useEffect(() => {
    try {
      // Dispatch an event to clear any cached font sizes
      // This is the minimal required action
      const clearEvent = new CustomEvent(CLEAR_FONT_CACHE_EVENT);
      document.dispatchEvent(clearEvent);
      
      console.log("EditorToolbar: Font cache clear event dispatched");
    } catch (error) {
      console.error("Error dispatching clear event:", error);
    }
  }, []);
};
