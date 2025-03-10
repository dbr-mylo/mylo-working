
import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

export interface FontFamilyOptions {
  types: string[];
  defaultFontFamily: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontFamily: {
      /**
       * Set the font family
       */
      setFontFamily: (fontFamily: string) => ReturnType;
    }
  }
}

export const FontFamily = Extension.create<FontFamilyOptions>({
  name: 'fontFamily',
  
  addOptions() {
    return {
      types: ['textStyle'],
      defaultFontFamily: 'Inter',
    };
  },
  
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: this.options.defaultFontFamily,
            parseHTML: element => element.style.fontFamily?.replace(/['"]/g, '') || this.options.defaultFontFamily,
            renderHTML: attributes => {
              if (!attributes.fontFamily) return {};
              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },
          textAlign: {
            default: 'left',
            parseHTML: element => element.style.textAlign,
            renderHTML: attributes => {
              if (!attributes.textAlign) return {};
              return {
                style: `text-align: ${attributes.textAlign}`,
              };
            },
          },
          textTransform: {
            default: null,
            parseHTML: element => element.style.textTransform,
            renderHTML: attributes => {
              if (!attributes.textTransform) return {};
              return {
                style: `text-transform: ${attributes.textTransform}`,
              };
            },
          },
          textDecoration: {
            default: null,
            parseHTML: element => element.style.textDecoration,
            renderHTML: attributes => {
              if (!attributes.textDecoration) return {};
              return {
                style: `text-decoration: ${attributes.textDecoration}`,
              };
            },
          },
        },
      },
    ];
  },
  
  addCommands() {
    return {
      setFontFamily: (fontFamily: string) => ({ commands }) => {
        return commands.setMark('textStyle', { fontFamily });
      },
    };
  },
});
