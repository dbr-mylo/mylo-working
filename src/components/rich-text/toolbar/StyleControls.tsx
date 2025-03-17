
import React from 'react';
import { Editor } from '@tiptap/react';
import { StyleDropdown } from '../StyleDropdown';
import { useAuth } from '@/contexts/AuthContext';

interface StyleControlsProps {
  editor: Editor;
}

export const StyleControls: React.FC<StyleControlsProps> = ({ editor }) => {
  const { role } = useAuth();
  const isDesigner = role === "designer";
  
  // Only render StyleDropdown for designer role
  if (!isDesigner) {
    return null;
  }
  
  return (
    <StyleDropdown editor={editor} />
  );
};
