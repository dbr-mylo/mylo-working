
import React from 'react';
import { Editor } from '@tiptap/react';
import { FontSelect } from '../FontSelect';
import { ColorPicker } from '../ColorPicker';
import { useAuth } from '@/contexts/AuthContext';

interface TextControlsProps {
  editor: Editor;
}

export const TextControls: React.FC<TextControlsProps> = ({ editor }) => {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  
  return (
    <div className="flex items-center gap-1">
      <FontSelect editor={editor} />
      <ColorPicker editor={editor} />
    </div>
  );
};
