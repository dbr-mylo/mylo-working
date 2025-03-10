
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
              const fontSize = element.style.fontSize;
              console.log("FontSize: Parsing fontSize from HTML:", fontSize);
              return fontSize;
            },
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              console.log("FontSize: Rendering fontSize to HTML:", attributes.fontSize);
              
              // Enhanced styling with even higher specificity
              return {
                style: `font-size: ${attributes.fontSize} !important; --tw-prose-body: none !important;`,
                class: 'custom-font-size',
                'data-font-size': attributes.fontSize.replace('px', '') // Add data attribute for easier debugging
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
            
            // Store the current font size in localStorage 
            localStorage.setItem('editor_font_size', fontSize);
            
            // Force clear any cached styles that might interfere
            try {
              const clearCacheEvent = new CustomEvent('tiptap-clear-font-cache');
              document.dispatchEvent(clearCacheEvent);
            } catch (e) {
              console.log("Error dispatching cache clear event:", e);
            }
            
            // Apply the font size with the text style mark
            const result = commands.setMark('textStyle', { fontSize });
            
            // Force a second update after a brief delay to ensure proper application
            setTimeout(() => {
              if (editor && editor.isActive) {
                console.log("FontSize: Re-applying font size to ensure it's set:", fontSize);
                editor.chain().focus().setMark('textStyle', { fontSize }).run();
              }
            }, 50);
            
            // Force a third update with a slightly longer delay for persistent styles
            setTimeout(() => {
              if (editor && editor.isActive) {
                console.log("FontSize: Final reinforcement of font size:", fontSize);
                editor.chain().focus().setMark('textStyle', { fontSize }).run();
              }
            }, 200);
            
            return result;
          }
          return commands.setMark('textStyle', { fontSize });
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          localStorage.removeItem('editor_font_size');
          return chain()
            .setMark('textStyle', { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});
