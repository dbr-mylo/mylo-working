
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
            console.log("RichTextEditor: Found element with explicit font-size:", fontSize);
            
            // Broadcast this size to synchronize toolbar
            const fontSizeEvent = new CustomEvent('tiptap-font-size-parsed', {
              detail: { fontSize, source: 'dom-init' }
            });
            document.dispatchEvent(fontSizeEvent);
            
            // Apply it to editor for consistency
            setTimeout(() => {
              if (editor && editor.isActive) {
                editor.commands.setFontSize(fontSize);
              }
            }, 50);
          } else {
            // No explicit styles found, check default paragraph
            const paragraphs = editorContainerRef.current.querySelectorAll('p');
            if (paragraphs.length > 0) {
              const computedStyle = window.getComputedStyle(paragraphs[0]);
              const fontSize = computedStyle.fontSize;
              console.log("RichTextEditor: No explicit style, using computed style:", fontSize);
              
              // Broadcast this computed size
              const fontSizeEvent = new CustomEvent('tiptap-font-size-parsed', {
                detail: { fontSize, source: 'dom-computed' }
              });
              document.dispatchEvent(fontSizeEvent);
            } else {
              console.log("RichTextEditor: No paragraphs found to check font size");
            }
          }
        }
      } catch (error) {
        console.error("Error checking initial font size:", error);
      }
    };
    
    // Run after editor is mounted and content is loaded
    const timeoutId = setTimeout(() => {
      initialSizeCheck();
      
      // Force one more refresh to ensure consistency
      const fontSizeEvent = new CustomEvent('tiptap-clear-font-cache');
      document.dispatchEvent(fontSizeEvent);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [editor, isEditable, content, editorContainerRef]);

  return null;
};
