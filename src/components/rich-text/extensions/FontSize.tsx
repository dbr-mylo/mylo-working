
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
              // Get font size from element style (with higher priority than computed style)
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
                  
                  // Create and dispatch an event with accurate font size from DOM
                  const fontSizeEvent = new CustomEvent('tiptap-font-size-parsed', {
                    detail: { fontSize: normalizedSize, source: 'dom' }
                  });
                  document.dispatchEvent(fontSizeEvent);
                  console.log("FontSize Extension: Parsed fontSize from HTML:", normalizedSize, "from original:", fontSize);
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
              
              console.log("FontSize Extension: Rendering fontSize to HTML:", formattedSize);
              
              // Use multiple attributes to ensure font size is applied consistently
              return {
                style: `font-size: ${formattedSize};`,
                class: 'custom-font-size preserve-styling',
                'data-font-size': formattedSize.replace('px', ''),
                'data-style-fontSize': formattedSize
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ commands, editor }) => {
          if (!fontSize) return false;
          
          // Ensure consistent px format
          const normalizedFontSize = fontSize.endsWith('px') 
            ? fontSize 
            : `${fontSize}px`;
          
          console.log("FontSize Extension: Setting fontSize command:", normalizedFontSize);
          
          try {
            // Store the current font size in localStorage
            localStorage.setItem('editor_font_size', normalizedFontSize);
            
            // Dispatch a reliable event for toolbar and other components
            const fontSizeChangeEvent = new CustomEvent('tiptap-font-size-changed', {
              detail: { fontSize: normalizedFontSize, source: 'command' }
            });
            document.dispatchEvent(fontSizeChangeEvent);
            
            // Refresh font cache immediately
            setTimeout(() => {
              const refreshEvent = new CustomEvent('tiptap-clear-font-cache');
              document.dispatchEvent(refreshEvent);
            }, 10);
          } catch (e) {
            console.error("Error in font size handling:", e);
          }
          
          // Apply the font size with the text style mark
          return commands.setMark('textStyle', { fontSize: normalizedFontSize });
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          localStorage.removeItem('editor_font_size');
          
          // Notify components that font size has been unset
          try {
            const fontSizeChangeEvent = new CustomEvent('tiptap-font-size-changed', {
              detail: { fontSize: null, source: 'command' }
            });
            document.dispatchEvent(fontSizeChangeEvent);
          } catch (e) {
            console.error("Error dispatching font size unset event:", e);
          }
          
          return chain()
            .setMark('textStyle', { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});
