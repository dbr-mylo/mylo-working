
import { Extension } from '@tiptap/react';

export const FontFamily = Extension.create({
  name: 'fontFamily',
  
  addAttributes() {
    return {
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
