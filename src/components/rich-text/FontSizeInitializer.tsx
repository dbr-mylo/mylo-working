
import { useEffect } from 'react';
import { Editor } from '@tiptap/react';

interface FontSizeInitializerProps {
  editor: Editor | null;
  isEditable: boolean;
  editorContainerRef: React.RefObject<HTMLDivElement>;
  content: string;
}

export const FontSizeInitializer: React.FC<FontSizeInitializerProps> = ({ 
  editor, 
  isEditable, 
  editorContainerRef,
  content
}) => {
  // Fix font size discrepancy by checking DOM directly on initialization
  useEffect(() => {
    if (!editor || !isEditable) return;
    
    const initialSizeCheck = () => {
      try {
        if (editorContainerRef.current) {
          // First check if we have explicit font-size styles
          const elements = editorContainerRef.current.querySelectorAll('[style*="font-size"]');
          
          if (elements.length > 0) {
            // Found explicit font sizes, use the first one as reference
            const element = elements[0] as HTMLElement;
            const fontSize = element.style.fontSize;
            
            // Broadcast this size to synchronize toolbar
            const fontSizeEvent = new CustomEvent('tiptap-font-size-parsed', {
              detail: { fontSize, source: 'dom-init' }
            });
            document.dispatchEvent(fontSizeEvent);
          } else {
            // No explicit styles found, check default paragraph
            const paragraphs = editorContainerRef.current.querySelectorAll('p');
            if (paragraphs.length > 0) {
              const computedStyle = window.getComputedStyle(paragraphs[0]);
              const fontSize = computedStyle.fontSize;
              
              // Broadcast this computed size
              const fontSizeEvent = new CustomEvent('tiptap-font-size-parsed', {
                detail: { fontSize, source: 'dom-computed' }
              });
              document.dispatchEvent(fontSizeEvent);
            }
          }
        }
      } catch (error) {
        console.error("Error checking initial font size:", error);
      }
    };
    
    // Run after editor is mounted and content is loaded
    const timeoutId = setTimeout(initialSizeCheck, 300);
    return () => clearTimeout(timeoutId);
  }, [editor, isEditable, content, editorContainerRef]);

  return null;
};
