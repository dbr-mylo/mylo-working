
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
              // This helps synchronize the UI with the actual font size in the DOM
              if (fontSize && typeof window !== 'undefined') {
                try {
                  const fontSizeEvent = new CustomEvent('tiptap-font-size-parsed', {
                    detail: { fontSize }
                  });
                  document.dispatchEvent(fontSizeEvent);
                  console.log("FontSize: Parsed and dispatched fontSize:", fontSize);
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
              console.log("FontSize: Rendering fontSize to HTML:", attributes.fontSize);
              
              // Use multiple approaches for maximum compatibility
              return {
                style: `font-size: ${attributes.fontSize} !important; --tw-prose-body: none !important;`,
                class: 'custom-font-size',
                'data-font-size': attributes.fontSize.replace('px', ''),
                'data-style-fontSize': attributes.fontSize // Additional attribute for tracking
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
            console.log("FontSize: Applying fontSize:", fontSize);
            
            // Store the current font size in localStorage and dispatch an event
            try {
              localStorage.setItem('editor_font_size', fontSize);
              
              // Dispatch an event to notify components about the font size change
              const fontSizeChangeEvent = new CustomEvent('tiptap-font-size-changed', {
                detail: { fontSize }
              });
              document.dispatchEvent(fontSizeChangeEvent);
              
              // Clear any cached styles that might interfere
              const clearCacheEvent = new CustomEvent('tiptap-clear-font-cache');
              document.dispatchEvent(clearCacheEvent);
            } catch (e) {
              console.error("Error in font size handling:", e);
            }
            
            // Apply the font size with the text style mark
            const result = commands.setMark('textStyle', { fontSize });
            
            // Schedule multiple updates to ensure the style is applied consistently
            const applyFontSize = () => {
              if (editor && editor.isActive) {
                editor.chain().focus().setMark('textStyle', { fontSize }).run();
                console.log("FontSize: Re-applying font size:", fontSize);
              }
            };
            
            // Apply multiple times with increasing delays for persistence
            setTimeout(applyFontSize, 50);
            setTimeout(applyFontSize, 200);
            setTimeout(applyFontSize, 500);
            
            return result;
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
