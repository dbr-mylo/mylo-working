
import React from 'react';
import { Editor } from '@tiptap/react';
import { RemoveFormatting } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearFormatting } from '../../rich-text/utils/textFormatting';
import { useToast } from '@/hooks/use-toast';
import { useIsWriter } from '@/utils/roles';
import { handleError } from '@/utils/errorHandling';

interface EditorClearFormattingButtonProps {
  editor: Editor;
}

export const EditorClearFormattingButton: React.FC<EditorClearFormattingButtonProps> = ({ editor }) => {
  const { toast } = useToast();
  
  // Make sure this component is only used in writer role
  const isWriter = useIsWriter();
  
  if (!isWriter) {
    console.warn("EditorClearFormattingButton used outside of writer role context");
    return null;
  }
  
  const handleClearFormatting = () => {
    if (!editor) return;
    
    try {
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
    } catch (error) {
      handleError(
        error,
        "EditorClearFormattingButton.handleClearFormatting",
        "Failed to clear formatting"
      );
    }
  };

  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={handleClearFormatting}
      title="Clear formatting"
      disabled={!editor || editor.state.selection.empty}
      className="border-0 p-1 hover:bg-accent/50"
      aria-label="Clear Formatting"
    >
      <RemoveFormatting className="h-3.5 w-3.5" />
    </Button>
  );
};
