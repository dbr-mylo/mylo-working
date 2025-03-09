
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
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
