
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

  return (
    <div className="rich-text-editor">
      {/* Include the color preservation styles */}
      <ColorPreservationStyles />
      
      {/* Include list and indent styles */}
      <ListAndIndentStyles />
      
      {/* Add template styles when enabled */}
      {applyTemplateStyling && templateStyles && (
        <style dangerouslySetInnerHTML={{ __html: templateStyles }} />
      )}
      
      {!hideToolbar && isEditable && !externalToolbar && (
        <Toolbar editor={activeEditor} />
      )}
      <EditorContent 
        editor={activeEditor} 
        className={`prose prose-sm max-w-none p-4 ${applyTemplateStyling ? 'template-styled' : ''}`} 
        style={dimensions ? {
          width: dimensions.width,
          minHeight: dimensions.height
        } : undefined}
      />
    </div>
  );
};
