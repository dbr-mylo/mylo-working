
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { LucideIcon, List, ListOrdered } from 'lucide-react';
import { preserveColorAfterFormatting } from '@/components/rich-text/utils/colorPreservation';

interface BaseListButtonProps {
  editor: Editor;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  title: string;
  currentColor: string;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
  className?: string;
  ariaLabel?: string;
}

export const BaseListButton: React.FC<BaseListButtonProps> = ({
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

// Specific list button types
export const BulletListButton: React.FC<{
  editor: Editor;
  currentColor: string;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
}> = ({ editor, currentColor, size }) => {
  const handleToggleBulletList = () => {
    preserveColorAfterFormatting(
      editor, 
      () => editor.chain().focus().toggleBulletList().run(), 
      currentColor
    );
  };

  return (
    <BaseListButton
      editor={editor}
      icon={List}
      isActive={editor.isActive('bulletList')}
      onClick={handleToggleBulletList}
      title="Bullet List"
      currentColor={currentColor}
      size={size}
    />
  );
};

export const OrderedListButton: React.FC<{
  editor: Editor;
  currentColor: string;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
}> = ({ editor, currentColor, size }) => {
  const handleToggleOrderedList = () => {
    preserveColorAfterFormatting(
      editor, 
      () => editor.chain().focus().toggleOrderedList().run(), 
      currentColor
    );
  };

  return (
    <BaseListButton
      editor={editor}
      icon={ListOrdered}
      isActive={editor.isActive('orderedList')}
      onClick={handleToggleOrderedList}
      title="Ordered List"
      currentColor={currentColor}
      size={size}
    />
  );
};
