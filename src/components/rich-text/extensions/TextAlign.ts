
import { Extension } from '@tiptap/core'
import { TextAlign as TiptapTextAlign } from '@tiptap/extension-text-align'

// Re-export the TipTap TextAlign extension with our default configuration
export const TextAlign = TiptapTextAlign.configure({
  types: ['heading', 'paragraph', 'blockquote', 'listItem'],
  alignments: ['left', 'center', 'right', 'justify'],
  defaultAlignment: 'left',
})

// Create a helper extension that adds text alignment commands to the editor
export const TextAlignmentCommands = Extension.create({
  name: 'textAlignmentCommands',
  
  addCommands() {
    return {
      // These commands provide a more direct API for our components to use
      setTextAlignLeft: () => ({ chain }) => {
        return chain().setTextAlign('left').run()
      },
      setTextAlignCenter: () => ({ chain }) => {
        return chain().setTextAlign('center').run()
      },
      setTextAlignRight: () => ({ chain }) => {
        return chain().setTextAlign('right').run()
      },
      setTextAlignJustify: () => ({ chain }) => {
        return chain().setTextAlign('justify').run()
      },
    }
  },
})
