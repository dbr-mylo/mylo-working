
import { useRef, useState, useCallback } from 'react';

export const useDocumentPreview = (onElementSelect?: (element: HTMLElement | null) => void) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  
  const handlePreviewClick = useCallback((e: React.MouseEvent) => {
    // Ensure we only select paragraphs, headings, spans, and list items
    const validElements = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'LI', 'UL', 'OL'];
    
    // Find the closest valid element
    const target = e.target as HTMLElement;
    const element = validElements.includes(target.tagName) 
      ? target 
      : target.closest(validElements.map(tag => tag.toLowerCase()).join(',')) as HTMLElement;
    
    // Clear previous selection
    if (selectedElement) {
      selectedElement.classList.remove('text-element-selected');
    }
    
    // Update selection
    if (element) {
      element.classList.add('text-element-selected');
      setSelectedElement(element);
      
      if (onElementSelect) {
        onElementSelect(element);
      }
    } else {
      setSelectedElement(null);
      if (onElementSelect) {
        onElementSelect(null);
      }
    }
  }, [selectedElement, onElementSelect]);
  
  const handleApplyStyle = useCallback((styles: Record<string, string>) => {
    if (!selectedElement) return;
    
    Object.entries(styles).forEach(([property, value]) => {
      selectedElement.style[property as any] = value;
    });
  }, [selectedElement]);
  
  return {
    previewRef,
    selectedElement,
    handlePreviewClick,
    handleApplyStyle
  };
};
