
import { useCallback, useRef } from 'react';

interface UseDebounceProps {
  callback: (...args: any[]) => void;
  delay: number;
}

export const useDebounce = ({ callback, delay }: UseDebounceProps) => {
  const timerRef = useRef<number | null>(null);
  
  const debouncedCallback = useCallback((...args: any[]) => {
    // Clear any existing timer
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    
    // Set a new timer
    timerRef.current = window.setTimeout(() => {
      callback(...args);
      timerRef.current = null;
    }, delay);
  }, [callback, delay]);
  
  // Function to cancel any pending debounced calls
  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { debouncedCallback, cancel };
};
