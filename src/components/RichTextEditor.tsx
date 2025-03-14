
/**
 * RichTextEditor Component
 * 
 * This component is used by both designer and editor roles.
 * Be extremely careful when modifying this component as it affects both user types.
 * Test any changes with both designer and editor roles before committing.
 */

import React, { useEffect } from 'react';
import { EditorContent, useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import { Toolbar } from './editor/Toolbar';
import { ColorPreservationStyles } from './rich-text/styles/ColorPreservationStyles';
import { IndentExtension } from './rich-text/extensions/IndentExtension';
import { ListAndIndentStyles } from './rich-text/styles/ListAndIndentStyles';
import { extractDimensionsFromCSS } from '@/utils/templateUtils';
import { BaseEditorStyles } from './rich-text/styles/BaseEditorStyles';

interface RichTextEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  isEditable?: boolean;
  hideToolbar?: boolean;
  renderToolbarOutside?: boolean;
  externalToolbar?: boolean;
  externalEditorInstance?: Editor | null;
  applyTemplateStyling?: boolean;
  templateStyles?: string;
}

export const RichTextEditor = ({
  content,
  onUpdate,
  isEditable = true,
  hideToolbar = false,
  renderToolbarOutside = false,
  externalToolbar = false,
  externalEditorInstance = null,
  applyTemplateStyling = false,
  templateStyles = '',
}: RichTextEditorProps) => {
  const dimensions = extractDimensionsFromCSS(templateStyles);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      IndentExtension,
    ],
    content,
    editable: isEditable,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  // Update content from props when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Use external editor instance if provided
  const activeEditor = externalEditorInstance || editor;

  if (!activeEditor) {
    return null;
  }

  // Get the width and height (defaulting to 8.5in x 11in)
  const width = dimensions?.width || '8.5in';
  const height = dimensions?.height || '11in';

  return (
    <div className="rich-text-editor">
      {/* Include the color preservation styles */}
      <ColorPreservationStyles />
      
      {/* Include list and indent styles */}
      <ListAndIndentStyles />
      
      {/* Include base editor styles */}
      <BaseEditorStyles />
      
      {/* Add template styles when enabled */}
      {applyTemplateStyling && templateStyles && (
        <style dangerouslySetInnerHTML={{ __html: templateStyles }} />
      )}
      
      {/* Render toolbar outside document dimensions */}
      {!hideToolbar && isEditable && !externalToolbar && (
        <div className="toolbar-container mb-2">
          <Toolbar editor={activeEditor} />
        </div>
      )}
      
      {/* Document styles for ProseMirror editor dimensions */}
      <style>
        {`
          .ProseMirror {
            width: ${width};
            min-height: ${height};
            padding: 1in;
            box-sizing: border-box;
            background-color: white;
            margin: 0 auto;
          }
        `}
      </style>
      
      <EditorContent 
        editor={activeEditor} 
        className="prose prose-sm max-w-none"
      />
    </div>
  );
};
