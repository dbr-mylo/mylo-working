
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface BaseIndentButtonProps {
  editor: Editor;
  icon: LucideIcon;
  onClick: () => void;
  title: string;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
  className?: string;
  ariaLabel?: string;
}

export const BaseIndentButton: React.FC<BaseIndentButtonProps> = ({
  icon: Icon,
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
      className={`border-0 p-1 hover:bg-accent/50 ${className}`}
      aria-label={ariaLabel || title}
      title={title}
    >
      <Icon className="h-3.5 w-3.5" />
    </Button>
  );
};

// Specific indent button types
export const IndentButton: React.FC<{
  editor: Editor;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
}> = ({ editor, size }) => {
  // Import the Indent icon dynamically
  const Indent = require('lucide-react').Indent;

  const handleIndent = () => {
    if (editor) {
      if (editor.isActive('bulletList')) {
        editor.chain().focus().updateAttributes('bulletList', { 
          indent: Math.min((editor.getAttributes('bulletList').indent || 0) + 1, 10)
        }).run();
      } else if (editor.isActive('orderedList')) {
        editor.chain().focus().updateAttributes('orderedList', { 
          indent: Math.min((editor.getAttributes('orderedList').indent || 0) + 1, 10)
        }).run();
      } else {
        editor.chain().focus().updateAttributes('paragraph', { 
          indent: Math.min((editor.getAttributes('paragraph').indent || 0) + 1, 10)
        }).run();
      }
    }
  };

  return (
    <BaseIndentButton
      editor={editor}
      icon={Indent}
      onClick={handleIndent}
      title="Indent paragraph"
      size={size}
    />
  );
};

export const OutdentButton: React.FC<{
  editor: Editor;
  size?: "default" | "sm" | "xs" | "xxs" | "lg" | "icon";
}> = ({ editor, size }) => {
  // Import the Outdent icon dynamically
  const Outdent = require('lucide-react').Outdent;

  const handleOutdent = () => {
    if (editor) {
      if (editor.isActive('bulletList')) {
        editor.chain().focus().updateAttributes('bulletList', { 
          indent: Math.max((editor.getAttributes('bulletList').indent || 0) - 1, 0)
        }).run();
      } else if (editor.isActive('orderedList')) {
        editor.chain().focus().updateAttributes('orderedList', { 
          indent: Math.max((editor.getAttributes('orderedList').indent || 0) - 1, 0)
        }).run();
      } else {
        editor.chain().focus().updateAttributes('paragraph', { 
          indent: Math.max((editor.getAttributes('paragraph').indent || 0) - 1, 0)
        }).run();
      }
    }
  };

  return (
    <BaseIndentButton
      editor={editor}
      icon={Outdent}
      onClick={handleOutdent}
      title="Outdent paragraph"
      size={size}
    />
  );
};
