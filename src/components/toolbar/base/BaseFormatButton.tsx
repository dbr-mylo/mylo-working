
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { LucideIcon, Bold, Italic } from 'lucide-react';
import { preserveColorAfterFormatting } from '@/components/rich-text/utils/colorPreservation';

interface BaseFormatButtonProps {
  editor: Editor;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  title: string;
  currentColor?: string;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export const BaseFormatButton: React.FC<BaseFormatButtonProps> = ({
  icon: Icon,
  isActive,
  onClick,
  title,
  size = "xs",
  className = "",
  disabled = false,
  ariaLabel,
}) => {
  return (
    <Button
      variant="ghost"
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={`border-0 p-1 ${isActive ? 'bg-accent' : 'hover:bg-accent/50'} ${className}`}
      aria-label={ariaLabel || title}
      title={title}
    >
      <Icon className="h-3.5 w-3.5" />
    </Button>
  );
};

// Format button types for different formatting options
export const BoldButton: React.FC<{
  editor: Editor;
  currentColor: string;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
}> = ({ editor, currentColor, size }) => {
  const handleToggleBold = () => {
    if (!editor) return;
    
    const { color } = editor.getAttributes('textStyle');
    const colorToPreserve = color || currentColor;
    
    editor.chain().focus().toggleBold().run();
    editor.chain().focus().setColor(colorToPreserve).run();
    
    // Apply color again after small delay to ensure it sticks
    setTimeout(() => {
      if (editor.isActive('bold')) {
        editor.chain().focus().setColor(colorToPreserve).run();
      }
    }, 10);
  };

  return (
    <BaseFormatButton
      editor={editor}
      icon={Bold}
      isActive={editor.isActive('bold')}
      onClick={handleToggleBold}
      title="Bold"
      currentColor={currentColor}
      size={size}
      disabled={!editor.can().chain().focus().toggleBold().run()}
    />
  );
};

export const ItalicButton: React.FC<{
  editor: Editor;
  currentColor: string;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
}> = ({ editor, currentColor, size }) => {
  const handleToggleItalic = () => {
    preserveColorAfterFormatting(
      editor, 
      () => editor.chain().focus().toggleItalic().run(), 
      currentColor
    );
  };

  return (
    <BaseFormatButton
      editor={editor}
      icon={Italic}
      isActive={editor.isActive('italic')}
      onClick={handleToggleItalic}
      title="Italic"
      currentColor={currentColor}
      size={size}
      disabled={!editor.can().chain().focus().toggleItalic().run()}
    />
  );
};
