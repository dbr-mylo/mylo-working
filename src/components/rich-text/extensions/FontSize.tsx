
import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

export interface FontSizeOptions {
  types: string[];
  defaultSize: string;
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
      defaultSize: '16px',
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
              return element.style.fontSize || null;
            },
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              
              // Ensure consistent formatting of font size (px format)
              const formattedSize = attributes.fontSize.endsWith('px') 
                ? attributes.fontSize 
                : `${attributes.fontSize}px`;
              
              // Use CSS variables to avoid the cascade issue
              return {
                style: `font-size: ${formattedSize}; --applied-font-size: ${formattedSize};`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize: fontSize => ({ commands, chain }) => {
        if (!fontSize) return false;
        
        // Ensure consistent px format
        const normalizedFontSize = fontSize.endsWith('px') 
          ? fontSize 
          : `${fontSize}px`;
        
        // Debug log to confirm command execution
        console.log("FontSize extension: Setting font size to", normalizedFontSize);
        
        // Apply font size to the text
        return commands.setMark('textStyle', { fontSize: normalizedFontSize });
      },
      
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});
