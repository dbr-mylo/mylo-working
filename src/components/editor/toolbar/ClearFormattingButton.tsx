
import React from 'react';
import { Editor } from '@tiptap/react';
import { RemoveFormatting } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearFormatting } from '../../rich-text/utils/textFormatting';
import { useToast } from '@/hooks/use-toast';

interface ClearFormattingButtonProps {
  editor: Editor;
}

export const ClearFormattingButton: React.FC<ClearFormattingButtonProps> = ({ editor }) => {
  const { toast } = useToast();
  
  const handleClearFormatting = () => {
    if (!editor) return;
    
    // Check if text is selected
    if (editor.state.selection.empty) {
      toast({
        title: "No text selected",
        description: "Please select some text to clear its formatting.",
        variant: "default",
        duration: 3000,
      });
      return;
    }
    
    // Clear the formatting
    clearFormatting(editor);
    
    // Show success toast
    toast({
      title: "Formatting cleared",
      description: "All formatting has been removed from the selected text.",
      variant: "default",
      duration: 2000,
    });
    
    // Force editor to refresh
    setTimeout(() => {
      if (editor.isEditable) {
        editor.commands.focus();
      }
    }, 50);
  };

  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={handleClearFormatting}
      title="Clear formatting"
      disabled={!editor || editor.state.selection.empty}
    >
      <RemoveFormatting className="h-3.5 w-3.5" />
    </Button>
  );
};
