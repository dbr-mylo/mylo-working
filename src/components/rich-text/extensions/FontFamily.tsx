
import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

export const FontFamily = Extension.create({
  name: 'fontFamily',
  
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  
  addCommands() {
    return {
      setFontFamily: (fontFamily: string) => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontFamily })
          .run();
      },
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
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
});
