
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FontPicker } from "@/components/rich-text/FontPicker";
import { textStyleStore } from "@/stores/textStyles";
import { useToast } from "@/hooks/use-toast";
import { TextStyle } from "@/lib/types";
import { clearTextStylesCache } from "@/stores/textStyles/storage";

interface DefaultFontModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStyle: TextStyle;
}

export const DefaultFontModal = ({ isOpen, onClose, defaultStyle }: DefaultFontModalProps) => {
  const [selectedFont, setSelectedFont] = React.useState(defaultStyle.fontFamily || "Inter");
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (isOpen && defaultStyle) {
      setSelectedFont(defaultStyle.fontFamily || "Inter");
    }
  }, [isOpen, defaultStyle]);
  
  const handleFontChange = (font: string) => {
    console.log("DefaultFontModal: Font changed to:", font);
    setSelectedFont(font);
  };
  
  const handleSave = async () => {
    try {
      // Create a copy of the defaultStyle with the updated font
      const updatedStyle: TextStyle = {
        ...defaultStyle,
        fontFamily: selectedFont,
        updated_at: new Date().toISOString()
      };
      
      console.log("Saving updated default style:", updatedStyle);
      
      // Save the updated style
      await textStyleStore.saveTextStyle(updatedStyle);
      
      // Update the default style ID in localStorage
      if (defaultStyle.id) {
        await textStyleStore.setDefaultStyle(defaultStyle.id);
      }
      
      // Clear the cache to force a refresh
      clearTextStylesCache();
      
      toast({
        title: "Default font updated",
        description: `Template will now use ${selectedFont} as the default font`
      });
      
      onClose();
      
      // Force a window storage event to trigger updates in other components
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error updating default font:", error);
      toast({
        title: "Error",
        description: "Failed to update default font",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Default Font</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Select a new default font for this template. This will be used when text is reset to default formatting.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Font:</span>
            <FontPicker 
              value={selectedFont} 
              onChange={handleFontChange}
              className="w-full"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Default Font</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
