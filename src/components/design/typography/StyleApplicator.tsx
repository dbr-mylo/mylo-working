
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { Button } from "@/components/ui/button";
import { Paintbrush, Check } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface StyleApplicatorProps {
  onApplyStyle: (styleId: string) => void;
  selectedElement?: HTMLElement | null;
}

export const StyleApplicator = ({ onApplyStyle, selectedElement }: StyleApplicatorProps) => {
  const [styles, setStyles] = useState<TextStyle[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const fetchedStyles = await textStyleStore.getTextStyles();
        setStyles(fetchedStyles);
      } catch (error) {
        console.error("Error loading text styles:", error);
        toast({
          title: "Error loading styles",
          description: "Could not load text styles",
          variant: "destructive",
        });
      }
    };

    fetchStyles();
  }, [toast]);

  if (!selectedElement) {
    return null;
  }

  const handleApplyStyle = (styleId: string) => {
    onApplyStyle(styleId);
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
            {styles.length > 0 ? (
              styles.map((style) => (
                <Button
                  key={style.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between text-left font-normal"
                  onClick={() => handleApplyStyle(style.id)}
                >
                  <div className="flex flex-col items-start">
                    <span>{style.name}</span>
                    <span className="text-xs text-muted-foreground">{style.selector || 'No selector'}</span>
                  </div>
                  <Check className="h-4 w-4 opacity-0 group-hover:opacity-50" />
                </Button>
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
