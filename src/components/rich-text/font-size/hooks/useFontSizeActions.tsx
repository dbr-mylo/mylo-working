
import { useCallback } from 'react';

interface UseFontSizeActionsProps {
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  onChange: (value: string) => void;
  disabled: boolean;
  MIN_FONT_SIZE: number;
  MAX_FONT_SIZE: number;
}

export const useFontSizeActions = ({
  size,
  setSize,
  onChange,
  disabled,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE
}: UseFontSizeActionsProps) => {
  const incrementSize = useCallback(() => {
    if (disabled) return;
    const newSize = Math.min(size + 1, MAX_FONT_SIZE);
    console.log("FontSizeInput: Incrementing from", size, "to", newSize);
    setSize(newSize);
    onChange(`${newSize}px`);
    
    // Dispatch event for other components
    try {
      const fontSizeEvent = new CustomEvent('tiptap-font-size-changed', {
        detail: { fontSize: `${newSize}px`, source: 'input' }
      });
      document.dispatchEvent(fontSizeEvent);
    } catch (error) {
      console.error("Error dispatching font size event:", error);
    }
  }, [size, setSize, onChange, disabled, MAX_FONT_SIZE]);

  const decrementSize = useCallback(() => {
    if (disabled) return;
    const newSize = Math.max(size - 1, MIN_FONT_SIZE);
    console.log("FontSizeInput: Decrementing from", size, "to", newSize);
    setSize(newSize);
    onChange(`${newSize}px`);
    
    // Dispatch event for other components
    try {
      const fontSizeEvent = new CustomEvent('tiptap-font-size-changed', {
        detail: { fontSize: `${newSize}px`, source: 'input' }
      });
      document.dispatchEvent(fontSizeEvent);
    } catch (error) {
      console.error("Error dispatching font size event:", error);
    }
  }, [size, setSize, onChange, disabled, MIN_FONT_SIZE]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    let inputValue = e.target.value.replace(/[^\d.]/g, ''); // Allow digits and decimal point
    
    if (inputValue === '') {
      setSize(0);
      return;
    }
    
    let newSize = parseFloat(inputValue);
    // Enforce min/max limits
    newSize = Math.max(Math.min(newSize, MAX_FONT_SIZE), 0);
    
    // Round to one decimal place for better usability
    newSize = Math.round(newSize * 10) / 10;
    
    setSize(newSize);
    console.log("FontSizeInput: Manual change to:", newSize);
    
    // Only update if value is within acceptable range
    if (newSize >= MIN_FONT_SIZE) {
      onChange(`${newSize}px`);
      
      // Dispatch event for other components
      try {
        const fontSizeEvent = new CustomEvent('tiptap-font-size-changed', {
          detail: { fontSize: `${newSize}px`, source: 'input' }
        });
        document.dispatchEvent(fontSizeEvent);
      } catch (error) {
        console.error("Error dispatching font size event:", error);
      }
    }
  }, [disabled, setSize, onChange, MIN_FONT_SIZE, MAX_FONT_SIZE]);

  const handleBlur = useCallback(() => {
    if (disabled) return;
    
    // When blurring, ensure the value is within range
    if (size < MIN_FONT_SIZE) {
      const newSize = MIN_FONT_SIZE;
      console.log("FontSizeInput: Correcting size to minimum:", newSize);
      setSize(newSize);
      onChange(`${newSize}px`);
      
      // Dispatch event for other components
      try {
        const fontSizeEvent = new CustomEvent('tiptap-font-size-changed', {
          detail: { fontSize: `${newSize}px`, source: 'input' }
        });
        document.dispatchEvent(fontSizeEvent);
      } catch (error) {
        console.error("Error dispatching font size event:", error);
      }
    }
  }, [disabled, size, MIN_FONT_SIZE, setSize, onChange]);

  return {
    incrementSize,
    decrementSize,
    handleInputChange,
    handleBlur
  };
};
