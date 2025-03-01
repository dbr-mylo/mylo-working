
import { Extension } from '@tiptap/react';

export const IndentExtension = Extension.create({
  name: 'indent',
  
  addAttributes() {
    return {
      indent: {
        default: 0,
        renderHTML: attributes => {
          if (attributes.indent === 0) return {}
          return {
            style: `margin-left: ${attributes.indent}em;`,
          }
        },
        parseHTML: element => {
          const indent = element.style.marginLeft
          if (!indent) return 0
          const value = parseInt(indent.match(/(\d+)/)?.[1] || '0', 10)
          return value || 0
        },
      },
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading', 'bulletList', 'orderedList'],
        attributes: {
          indent: {
            default: 0,
            renderHTML: attributes => {
              if (attributes.indent === 0) return {}
              return {
                style: `margin-left: ${attributes.indent}em;`,
              }
            },
            parseHTML: element => {
              const indent = element.style.marginLeft
              if (!indent) return 0
              const value = parseInt(indent.match(/(\d+)/)?.[1] || '0', 10)
              return value || 0
            },
          },
        },
      },
    ]
  },
});
