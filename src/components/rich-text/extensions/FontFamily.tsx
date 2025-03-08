
import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

export const FontFamily = Extension.create({
  name: 'fontFamily',
  
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
          fontFamily: {
            default: 'Inter',
            parseHTML: element => element.style.fontFamily?.replace(/['"]/g, ''),
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
    // The proper way to implement commands for TipTap extensions
    // is to return an object with function factories that take parameters
    // and return command functions
    return {
      setFontFamily: (fontFamily: string) => ({ chain }) => {
        // Use chain instead of commands for better TypeScript compatibility
        return chain().setMark('textStyle', { fontFamily }).run();
      },
    };
  },
});
