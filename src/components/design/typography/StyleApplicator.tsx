
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { Paintbrush, Pilcrow } from "lucide-react";

interface StyleApplicatorProps {
  onApplyStyle: (styleId: string) => void;
}

export const StyleApplicator = ({ onApplyStyle }: StyleApplicatorProps) => {
  const [styles, setStyles] = useState<TextStyle[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadStyles = async () => {
      const textStyles = await textStyleStore.getTextStyles();
      setStyles(textStyles);
    };
    
    loadStyles();
  }, []);

  const handleApplyStyle = (styleId: string) => {
    onApplyStyle(styleId);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Paintbrush className="h-4 w-4" />
          Apply Style
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {styles.length === 0 ? (
            <p className="text-xs text-muted-foreground p-2">
              No styles available
            </p>
          ) : (
            styles.map((style) => (
              <Card
                key={style.id}
                className="p-2 hover:bg-accent cursor-pointer flex items-center gap-2"
                onClick={() => handleApplyStyle(style.id)}
              >
                <Pilcrow className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs">{style.name}</span>
              </Card>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
