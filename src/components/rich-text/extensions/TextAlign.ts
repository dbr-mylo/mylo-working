
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
      // Updated to return a proper command structure that's compatible with Partial<RawCommands>
      setTextAlignLeft: () => ({ commands }) => {
        return commands.setTextAlign('left')
      },
      setTextAlignCenter: () => ({ commands }) => {
        return commands.setTextAlign('center')
      },
      setTextAlignRight: () => ({ commands }) => {
        return commands.setTextAlign('right')
      },
      setTextAlignJustify: () => ({ commands }) => {
        return commands.setTextAlign('justify')
      },
    }
  },
})
