
import React from 'react';
import { EditorToolbar } from '@/components/rich-text/EditorToolbar';
import { useEditorSetup } from '@/components/rich-text/useEditor';

interface ToolSettingsMenuBarProps {
  children?: React.ReactNode;
}

export const ToolSettingsMenuBar: React.FC<ToolSettingsMenuBarProps> = ({ children }) => {
  // Get the global editor instance (this will need to be implemented with a context)
  const activeEditor = document.querySelector('.ProseMirror')?.tiptapEditor;
  
  return (
    <div className="w-full bg-slate-50 border-b border-slate-200">
      <div className="w-full mx-auto">
        {children || (
          <div className="flex items-center h-10 px-4">
            {activeEditor ? (
              <EditorToolbar 
                editor={activeEditor} 
                currentFont={activeEditor.getAttributes('textStyle').fontFamily || 'Inter'} 
                currentColor={activeEditor.getAttributes('textStyle').color || '#000000'} 
                onFontChange={(font) => activeEditor.chain().focus().setMark('textStyle', { fontFamily: font }).run()}
                onColorChange={(color) => activeEditor.chain().focus().setColor(color).run()}
              />
            ) : (
              <span className="text-sm text-slate-500">Tool settings will appear here</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
