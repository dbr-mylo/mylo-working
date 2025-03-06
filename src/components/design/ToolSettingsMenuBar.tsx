
import React from 'react';
import { EditorToolbar } from '@/components/rich-text/EditorToolbar';
import { Editor } from '@tiptap/react';

interface ToolSettingsMenuBarProps {
  children?: React.ReactNode;
}

export const ToolSettingsMenuBar: React.FC<ToolSettingsMenuBarProps> = ({ children }) => {
  // Get the global editor instance using a safer approach
  const [activeEditor, setActiveEditor] = React.useState<Editor | null>(null);
  
  React.useEffect(() => {
    // Find the editor element
    const editorElement = document.querySelector('.ProseMirror');
    
    if (editorElement) {
      // Access the custom property with a proper type assertion
      const editor = (editorElement as any).tiptapEditor as Editor | undefined;
      setActiveEditor(editor || null);
    }
    
    // Setup a mutation observer to watch for editor changes
    const observer = new MutationObserver(() => {
      const editorEl = document.querySelector('.ProseMirror');
      if (editorEl) {
        const editor = (editorEl as any).tiptapEditor as Editor | undefined;
        setActiveEditor(editor || null);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
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
