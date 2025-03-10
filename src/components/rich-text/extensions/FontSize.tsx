
import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

export interface FontSizeOptions {
  types: string[];
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
              const fontSize = element.style.fontSize;
              
              // Create and dispatch a custom event with the parsed font size
              if (fontSize && typeof window !== 'undefined') {
                try {
                  const fontSizeEvent = new CustomEvent('tiptap-font-size-parsed', {
                    detail: { fontSize }
                  });
                  document.dispatchEvent(fontSizeEvent);
                  console.log("FontSize Extension: Parsed fontSize from HTML:", fontSize);
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
              
              // Log the font size being rendered
              console.log("FontSize Extension: Rendering fontSize to HTML:", attributes.fontSize);
              
              // Use multiple attributes to ensure font size is applied consistently
              return {
                style: `font-size: ${attributes.fontSize} !important;`,
                class: 'custom-font-size',
                'data-font-size': attributes.fontSize.replace('px', ''),
                'data-style-fontSize': attributes.fontSize
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
          if (fontSize) {
            console.log("FontSize Extension: Setting fontSize command:", fontSize);
            
            // Store the current font size in localStorage to persist across sessions
            try {
              localStorage.setItem('editor_font_size', fontSize);
              
              // Dispatch an event to notify components about the font size change
              const fontSizeChangeEvent = new CustomEvent('tiptap-font-size-changed', {
                detail: { fontSize }
              });
              document.dispatchEvent(fontSizeChangeEvent);
              
              // Also refresh the extension's cache
              setTimeout(() => {
                const refreshEvent = new CustomEvent('tiptap-clear-font-cache');
                document.dispatchEvent(refreshEvent);
              }, 10);
            } catch (e) {
              console.error("Error in font size handling:", e);
            }
            
            // Apply the font size with the text style mark
            return commands.setMark('textStyle', { fontSize });
          }
          return commands.setMark('textStyle', { fontSize });
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          localStorage.removeItem('editor_font_size');
          
          // Notify components that font size has been unset
          try {
            const fontSizeChangeEvent = new CustomEvent('tiptap-font-size-changed', {
              detail: { fontSize: null }
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
