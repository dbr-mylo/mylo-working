
import React from 'react';
import { Editor } from '@tiptap/react';
import { RemoveFormatting } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearFormatting } from '@/components/rich-text/utils/textFormatting';
import { useToast } from '@/hooks/use-toast';
import { useIsDesigner } from '@/utils/roles';
import { CLEAR_FONT_CACHE_EVENT } from '@/components/rich-text/font-size/constants';

interface DesignerClearFormattingButtonProps {
  editor: Editor;
  onFontChange: (font: string) => void;
  onColorChange: (color: string) => void;
}

export const DesignerClearFormattingButton: React.FC<DesignerClearFormattingButtonProps> = ({
  editor,
  onFontChange,
  onColorChange
}) => {
  const { toast } = useToast();
  const isDesigner = useIsDesigner();
  
  if (!isDesigner) {
    console.warn("DesignerClearFormattingButton used outside of designer role context");
    return null;
  }
  
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
    
    // We need to update the UI state to reflect cleared formatting
    onFontChange('Inter');
    onColorChange('#000000');
    
    // Force a font cache clear to refresh all UI elements
    document.dispatchEvent(new CustomEvent(CLEAR_FONT_CACHE_EVENT));
    
    // Show success toast
    toast({
      title: "Formatting cleared",
      description: "All formatting has been removed from the selected text.",
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
      size="xxs"
      onClick={handleClearFormatting}
      title="Clear formatting"
      className="flex items-center gap-1 border-0 p-1"
      disabled={!editor || editor.state.selection.empty}
    >
      <RemoveFormatting className="h-3.5 w-3.5" />
    </Button>
  );
};
