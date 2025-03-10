
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { textStyleStore } from '@/stores/textStyles';

interface FontSizeInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const FontSizeInput = ({ value, onChange, className, disabled = false }: FontSizeInputProps) => {
  // Constant for min/max font size values according to requirements
  const MIN_FONT_SIZE = 1;
  const MAX_FONT_SIZE = 99;

  // Extract the numeric value from the font size string (e.g., "16px" -> 16)
  const getNumericValue = (fontSizeValue: string): number => {
    const match = fontSizeValue.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 16; // Default to 16 if parsing fails
  };

  const [size, setSize] = useState<number>(getNumericValue(value));
  
  // Handler for font size events with priority for DOM-sourced values
  const handleFontSizeEvent = useCallback((event: CustomEvent) => {
    if (event.detail) {
      // Prioritize DOM-sourced values for accurate representation
      const isDomSource = event.detail.source === 'dom';
      const newSize = getNumericValue(event.detail.fontSize);
      
      console.log(`FontSizeInput: Received font size event (${isDomSource ? 'DOM source' : 'command source'})`, 
        event.detail.fontSize, "parsed to:", newSize);
      
      // Always update from DOM source or if size is different
      if (isDomSource || newSize !== size) {
        setSize(newSize);
        // Only propagate changes from DOM to ensure toolbar matches DOM
        if (isDomSource && onChange && !disabled) {
          onChange(`${newSize}px`);
        }
      }
    }
  }, [size, onChange, disabled]);
  
  // Update internal state when external value changes
  useEffect(() => {
    const newSize = getNumericValue(value);
    if (newSize !== size) {
      setSize(newSize);
      console.log("FontSizeInput: Value prop changed to:", value, "internal size updated to:", newSize);
    }
  }, [value, size]);

  // Listen for font size events from the editor
  useEffect(() => {
    // Clear any cached styles
    try {
      textStyleStore.clearCachedStylesByPattern(['font-size', 'fontSize']);
    } catch (error) {
      console.error("Error clearing font size cache:", error);
    }
    
    // Add event listeners with proper typing
    document.addEventListener('tiptap-font-size-parsed', handleFontSizeEvent as EventListener);
    document.addEventListener('tiptap-font-size-changed', handleFontSizeEvent as EventListener);
    
    return () => {
      // Clean up event listeners
      document.removeEventListener('tiptap-font-size-parsed', handleFontSizeEvent as EventListener);
      document.removeEventListener('tiptap-font-size-changed', handleFontSizeEvent as EventListener);
    };
  }, [handleFontSizeEvent]);

  // Directly check DOM for font size in selection
  useEffect(() => {
    if (disabled) return;
    
    const checkDomFontSize = () => {
      try {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          if (!range.collapsed) {
            const span = document.createElement('span');
            range.surroundContents(span);
            const computedStyle = window.getComputedStyle(span);
            const domFontSize = computedStyle.fontSize;
            
            if (domFontSize) {
              const newSize = getNumericValue(domFontSize);
              console.log("FontSizeInput: DOM font size check:", domFontSize, "parsed to:", newSize);
              
              if (newSize !== size) {
                setSize(newSize);
                onChange(`${newSize}px`);
              }
            }
            
            // Remove the temporary span
            const parent = span.parentNode;
            while (span.firstChild) {
              parent?.insertBefore(span.firstChild, span);
            }
            parent?.removeChild(span);
          }
        }
      } catch (error) {
        // Safely ignore errors during DOM inspection
      }
    };
    
    // Check DOM on focus
    const handleFocus = () => {
      checkDomFontSize();
    };
    
    document.addEventListener('selectionchange', handleFocus);
    return () => {
      document.removeEventListener('selectionchange', handleFocus);
    };
  }, [size, onChange, disabled]);

  const incrementSize = () => {
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
  };

  const decrementSize = () => {
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
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    let inputValue = e.target.value.replace(/\D/g, '');
    
    if (inputValue === '') {
      setSize(0);
      return;
    }
    
    let newSize = parseInt(inputValue, 10);
    // Enforce min/max limits
    newSize = Math.max(Math.min(newSize, MAX_FONT_SIZE), 0);
    
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
  };

  const handleBlur = () => {
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
  };

  return (
    <div className={`flex items-center ${className || ''}`}>
      <div className={`relative flex items-center ${disabled ? 'opacity-50' : ''}`}>
        <Input
          type="text"
          value={size}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-10 h-7 px-0"
          maxLength={2}
          disabled={disabled}
          style={{ 
            textAlign: 'left',
            paddingLeft: '0.375rem',
            padding: '0.25rem 0 0.25rem 0.375rem'
          }}
        />
        <div className="absolute right-0 flex flex-col h-full">
          <button 
            type="button"
            onClick={incrementSize}
            disabled={disabled}
            className={`flex items-center justify-center h-3.5 w-4 ${disabled ? 'cursor-not-allowed' : 'hover:bg-gray-100'}`}
            aria-label="Increase font size"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button 
            type="button"
            onClick={decrementSize}
            disabled={disabled}
            className={`flex items-center justify-center h-3.5 w-4 ${disabled ? 'cursor-not-allowed' : 'hover:bg-gray-100'}`}
            aria-label="Decrease font size"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
