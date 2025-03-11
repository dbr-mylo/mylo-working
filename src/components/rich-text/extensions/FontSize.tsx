
import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

export interface FontSizeOptions {
  types: string[];
  defaultSize: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Set the font size
       */
      setFontSize: (fontSize: string) => ReturnType;
      /**
       * Unset the font size
       */
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Extension.create<FontSizeOptions>({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
      defaultSize: '16px',
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => {
              // Get font size from element style
              const inlineSize = element.style.fontSize;
              const computedSize = window.getComputedStyle(element).fontSize;
              const fontSize = inlineSize || computedSize;
              
              if (fontSize) {
                try {
                  // Normalize font size to ensure it's in px format
                  let normalizedSize = fontSize;
                  if (!normalizedSize.endsWith('px') && !isNaN(parseFloat(normalizedSize))) {
                    normalizedSize = `${parseFloat(normalizedSize)}px`;
                  }
                  
                  // Dispatch font size event
                  const fontSizeEvent = new CustomEvent('tiptap-font-size-parsed', {
                    detail: { fontSize: normalizedSize, source: 'dom' }
                  });
                  document.dispatchEvent(fontSizeEvent);
                } catch (e) {
                  console.error("Error dispatching font size event:", e);
                }
              }
              
              return fontSize;
            },
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              
              // Ensure consistent formatting of font size (px format)
              const formattedSize = attributes.fontSize.endsWith('px') 
                ? attributes.fontSize 
                : `${attributes.fontSize}px`;
              
              // Return essential attributes for font size styling
              return {
                style: `font-size: ${formattedSize};`,
                'data-font-size': formattedSize.replace('px', '')
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize: fontSize => ({ commands }) => {
        if (!fontSize) return false;
        
        // Ensure consistent px format
        const normalizedFontSize = fontSize.endsWith('px') 
          ? fontSize 
          : `${fontSize}px`;
        
        // Store in localStorage for persistence
        localStorage.setItem('editor_font_size', normalizedFontSize);
        
        // Dispatch font size change event
        const fontSizeChangeEvent = new CustomEvent('tiptap-font-size-changed', {
          detail: { fontSize: normalizedFontSize, source: 'command' }
        });
        document.dispatchEvent(fontSizeChangeEvent);
        
        // Apply font size
        return commands.setMark('textStyle', { fontSize: normalizedFontSize });
      },
      
      unsetFontSize: () => ({ chain }) => {
        localStorage.removeItem('editor_font_size');
        
        // Notify components that font size has been unset
        const fontSizeChangeEvent = new CustomEvent('tiptap-font-size-changed', {
          detail: { fontSize: null, source: 'command' }
        });
        document.dispatchEvent(fontSizeChangeEvent);
        
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});
