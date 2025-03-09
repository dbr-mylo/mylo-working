
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Paintbrush } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StyleListItem } from "./StyleListItem";
import { useTextStyles } from "./hooks/useTextStyles";

interface StyleApplicatorProps {
  onApplyStyle: (styleId: string) => Promise<void> | Promise<boolean>;
  selectedElement?: HTMLElement | null;
  isForEditor?: boolean;
}

export const StyleApplicator = ({ onApplyStyle, selectedElement, isForEditor = false }: StyleApplicatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { styles, isLoading } = useTextStyles();

  // For DOM elements, only show if an element is selected
  // For editor, always show as we can apply at cursor position
  const shouldShow = isForEditor || selectedElement;
  
  if (!shouldShow) {
    return null;
  }

  const handleApplyStyle = async (styleId: string) => {
    await onApplyStyle(styleId);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Paintbrush className="h-4 w-4" />
          <span>Apply Style</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <h4 className="font-medium text-sm mb-2">Select Style to Apply</h4>
        <ScrollArea className="h-[300px] pr-3">
          <div className="space-y-1">
            {isLoading ? (
              <p className="text-xs text-center py-4 text-muted-foreground">
                Loading styles...
              </p>
            ) : styles.length > 0 ? (
              styles.map((style) => (
                <StyleListItem 
                  key={style.id} 
                  style={style} 
                  onSelect={handleApplyStyle} 
                />
              ))
            ) : (
              <p className="text-xs text-center py-4 text-muted-foreground">
                No styles available. Create a style first.
              </p>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
