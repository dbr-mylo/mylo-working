
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
              return {
                style: `font-size: ${attributes.fontSize} !important`,
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
        ({ commands }) => {
          // Store the current font size in localStorage 
          // as a temporary solution until state syncing is fully fixed
          if (fontSize) {
            console.log("FontSize: Applying fontSize:", fontSize);
            localStorage.setItem('editor_font_size', fontSize);
            
            // Force an update to ensure the size is applied
            setTimeout(() => {
              console.log("FontSize: Re-applying font size to ensure it's set");
            }, 10);
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
