
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { LucideIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface BaseAlignmentButtonProps {
  editor: Editor;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  title: string;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
  className?: string;
  ariaLabel?: string;
}

export const BaseAlignmentButton: React.FC<BaseAlignmentButtonProps> = ({
  icon: Icon,
  isActive,
  onClick,
  title,
  size = "xs",
  className = "",
  ariaLabel,
}) => {
  return (
    <Button
      variant="ghost"
      size={size}
      onClick={onClick}
      className={`border-0 p-1 ${isActive ? 'bg-accent' : 'hover:bg-accent/50'} ${className}`}
      aria-label={ariaLabel || title}
      title={title}
    >
      <Icon className="h-3.5 w-3.5" />
    </Button>
  );
};

// Specific alignment button types
export const AlignLeftButton: React.FC<{
  editor: Editor;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
}> = ({ editor, size }) => {
  const handleAlignLeft = () => {
    editor.chain().focus().setTextAlign('left').run();
  };

  return (
    <BaseAlignmentButton
      editor={editor}
      icon={AlignLeft}
      isActive={editor.isActive({ textAlign: 'left' })}
      onClick={handleAlignLeft}
      title="Align Left"
      size={size}
    />
  );
};

export const AlignCenterButton: React.FC<{
  editor: Editor;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
}> = ({ editor, size }) => {
  const handleAlignCenter = () => {
    editor.chain().focus().setTextAlign('center').run();
  };

  return (
    <BaseAlignmentButton
      editor={editor}
      icon={AlignCenter}
      isActive={editor.isActive({ textAlign: 'center' })}
      onClick={handleAlignCenter}
      title="Align Center"
      size={size}
    />
  );
};

export const AlignRightButton: React.FC<{
  editor: Editor;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
}> = ({ editor, size }) => {
  const handleAlignRight = () => {
    editor.chain().focus().setTextAlign('right').run();
  };

  return (
    <BaseAlignmentButton
      editor={editor}
      icon={AlignRight}
      isActive={editor.isActive({ textAlign: 'right' })}
      onClick={handleAlignRight}
      title="Align Right"
      size={size}
    />
  );
};
