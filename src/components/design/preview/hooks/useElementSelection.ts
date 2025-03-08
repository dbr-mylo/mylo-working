
import { useState, useRef, useEffect } from "react";

export const useElementSelection = (
  onElementSelect?: (element: HTMLElement | null) => void
) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

  // Handle element selection in preview
  const handlePreviewClick = (e: React.MouseEvent) => {
    // Find the deepest text element
    let target = e.target as HTMLElement;
    
    // If clicking directly on the container, deselect
    if (target === previewRef.current) {
      setSelectedElement(null);
      if (onElementSelect) onElementSelect(null);
      return;
    }
    
    // Look for valid text elements
    while (target && !['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'LI', 'BLOCKQUOTE'].includes(target.tagName)) {
      if (!target.parentElement || target.parentElement === previewRef.current) break;
      target = target.parentElement;
    }
    
    // Update selection
    setSelectedElement(target);
    if (onElementSelect) onElementSelect(target);
    
    // Remove previous selections
    document.querySelectorAll('.text-element-selected').forEach(el => {
      el.classList.remove('text-element-selected');
    });
    
    // Add selection to current element
    if (target) {
      target.classList.add('text-element-selected');
    }
  };

  // Clean up selection when component unmounts
  useEffect(() => {
    return () => {
      document.querySelectorAll('.text-element-selected').forEach(el => {
        el.classList.remove('text-element-selected');
      });
    };
  }, []);

  return {
    previewRef,
    selectedElement,
    handlePreviewClick
  };
};
