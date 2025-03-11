
import { useCallback } from 'react';
import { EVENT_SOURCES } from '../constants';
import { parseFontSize, formatFontSize } from '../utils';
import { DEFAULT_FONT_SIZE } from '../constants';

interface UseFontSizeEventHandlingProps {
  size: number;
  setSize: (size: number) => void;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const useFontSizeEventHandling = ({
  size,
  setSize,
  onChange,
  disabled
}: UseFontSizeEventHandlingProps) => {
  // Handler for font size events with priority for DOM-sourced values
  return useCallback((event: CustomEvent) => {
    if (!event.detail || !event.detail.fontSize) return;
    
    // Prioritize DOM-sourced values for accurate representation
    const source = event.detail.source || EVENT_SOURCES.UNKNOWN;
    const isDomSource = source.includes('dom');
    const newSize = parseFontSize(event.detail.fontSize, DEFAULT_FONT_SIZE);
    
    console.log(`FontSizeInput: Received font size event (${source})`, 
      event.detail.fontSize, "parsed to:", newSize, "current size:", size);
    
    // Always update from DOM source or if size is different
    if (isDomSource || Math.abs(newSize - size) > 0.1) {
      setSize(newSize);
      // Propagate changes from DOM to ensure toolbar matches DOM
      if (!disabled) {
        onChange(formatFontSize(newSize));
      }
    }
  }, [size, onChange, disabled, setSize]);
};
