
import { useState, useRef, useEffect } from "react";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";

export const useDocumentPreview = (
  onElementSelect?: (element: HTMLElement | null) => void
) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const { toast } = useToast();

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

  // Handle applying a style to the selected element
  const handleApplyStyle = async (styleId: string) => {
    if (!selectedElement) return;
    
    try {
      // Get the style with all inherited properties
      const styleToApply = await textStyleStore.getStyleWithInheritance(styleId);
      
      if (!styleToApply) {
        toast({
          title: "Style not found",
          description: "The selected style could not be found.",
          variant: "destructive",
        });
        return;
      }
      
      // Apply the style to the selected element
      selectedElement.style.fontFamily = styleToApply.fontFamily;
      selectedElement.style.fontSize = styleToApply.fontSize;
      selectedElement.style.fontWeight = styleToApply.fontWeight;
      selectedElement.style.color = styleToApply.color;
      selectedElement.style.lineHeight = styleToApply.lineHeight;
      selectedElement.style.letterSpacing = styleToApply.letterSpacing;
      
      if (styleToApply.textAlign) {
        selectedElement.style.textAlign = styleToApply.textAlign;
      }
      
      if (styleToApply.textTransform) {
        selectedElement.style.textTransform = styleToApply.textTransform;
      }
      
      if (styleToApply.textDecoration) {
        selectedElement.style.textDecoration = styleToApply.textDecoration;
      }
      
      if (styleToApply.marginTop) {
        selectedElement.style.marginTop = styleToApply.marginTop;
      }
      
      if (styleToApply.marginBottom) {
        selectedElement.style.marginBottom = styleToApply.marginBottom;
      }
      
      // Apply any custom properties
      if (styleToApply.customProperties) {
        Object.entries(styleToApply.customProperties).forEach(([property, value]) => {
          selectedElement.style[property as any] = value;
        });
      }
      
      // Add a class based on the style selector if it exists and doesn't start with a dot
      if (styleToApply.selector && !styleToApply.selector.startsWith('.')) {
        // Remove existing style classes
        selectedElement.className = selectedElement.className
          .split(' ')
          .filter(c => !c.startsWith('style-'))
          .join(' ');
        
        // Add new style class
        selectedElement.classList.add(`style-${styleToApply.id}`);
      }
      
      toast({
        title: "Style applied",
        description: `Applied "${styleToApply.name}" to the selected element.`,
      });
    } catch (error) {
      console.error("Error applying style:", error);
      toast({
        title: "Error applying style",
        description: "There was a problem applying the style.",
        variant: "destructive",
      });
    }
  };

  return {
    previewRef,
    selectedElement,
    handlePreviewClick,
    handleApplyStyle
  };
};
