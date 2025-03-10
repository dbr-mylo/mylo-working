
import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';
import { FontUnit, convertFontSize, extractFontSizeValue } from '@/lib/types/preferences';

export interface FontSizeOptions {
  types: string[];
  defaultUnit?: FontUnit;
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
      defaultUnit: 'px',
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }

              // Ensure the font size has a unit
              let fontSize = attributes.fontSize;
              
              // If it doesn't end with a unit, add the default unit
              if (!fontSize.match(/\d+(px|pt|rem|em|%)$/)) {
                fontSize = `${fontSize}${this.options.defaultUnit}`;
              }

              return {
                style: `font-size: ${fontSize}`,
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
        ({ chain }) => {
          // Ensure the font size has a unit
          if (!fontSize.match(/\d+(px|pt|rem|em|%)$/)) {
            fontSize = `${fontSize}${this.options.defaultUnit}`;
          }
          
          console.log("Setting font size to:", fontSize);
          return chain().setMark('textStyle', { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark('textStyle', { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});
