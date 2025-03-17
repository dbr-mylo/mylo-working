
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
import { EditorStyles } from './rich-text/styles';
import { IndentExtension } from './rich-text/extensions/IndentExtension';
import { extractDimensionsFromCSS } from '@/utils/templateUtils';

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
    editorProps: {
      attributes: {
        class: 'font-sans' 
      }
    }
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
    
    // Set default font to Inter when editor is first created
    if (editor && editor.isEditable) {
      editor.chain().focus().setFontFamily('Inter').run();
    }
  }, [content, editor]);

  const activeEditor = externalEditorInstance || editor;

  if (!activeEditor) {
    return null;
  }

  const width = dimensions?.width || '8.5in';
  const height = dimensions?.height || '11in';

  return (
    <div className="rich-text-editor">
      {/* Consolidated styles component */}
      <EditorStyles />
      
      {applyTemplateStyling && templateStyles && (
        <style dangerouslySetInnerHTML={{ __html: templateStyles }} />
      )}
      
      {/* Toolbar positioned directly above document */}
      {!hideToolbar && isEditable && !externalToolbar && (
        <div className="toolbar-container mb-4">
          <Toolbar editor={activeEditor} />
        </div>
      )}
      
      <style>
        {`
          .ProseMirror {
            width: ${width};
            min-height: ${height};
            padding: 1in;
            box-sizing: border-box;
            background-color: white;
            margin: 0 auto;
            border: 1px solid var(--border);
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            font-family: Inter, sans-serif !important;
          }
          
          .toolbar-container {
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
          }
        `}
      </style>
      
      <EditorContent 
        editor={activeEditor} 
        className="prose prose-sm max-w-none font-sans"
      />
    </div>
  );
};
