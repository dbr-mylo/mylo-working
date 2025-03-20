
import { useState } from "react";
import { Editor } from "@tiptap/react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTextStyles } from "@/components/design/typography/hooks/useTextStyles";
import { useStyleApplication } from "@/hooks/useStyleApplication";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Text } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { StyleListItem } from "@/components/design/typography/StyleListItem";

interface StyleDropdownProps {
  editor: Editor;
}

export const StyleDropdown = ({ editor }: StyleDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { styles, isLoading } = useTextStyles();
  const { applyStyle } = useStyleApplication(editor);
  const { role } = useAuth();
  const isDesigner = role === "designer";

  const handleStyleSelect = (styleId: string) => {
    applyStyle(styleId);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size={isDesigner ? "xxs" : "xs"}
          className={`${isDesigner ? 'h-7' : 'h-8'} gap-1 px-2 font-normal`}
        >
          <Text className="h-3 w-3" />
          <span className="text-xs">Styles</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <h4 className="text-sm font-medium mb-2">Text Styles</h4>
        {isLoading ? (
          <p className="text-xs text-muted-foreground py-2">Loading styles...</p>
        ) : (
          <ScrollArea className="h-56 pr-3">
            <div className="space-y-1">
              {styles.length > 0 ? (
                styles.map((style) => (
                  <StyleListItem
                    key={style.id}
                    style={style}
                    onSelect={() => handleStyleSelect(style.id)}
                    compact={true}
                  />
                ))
              ) : (
                <p className="text-xs text-muted-foreground py-2">
                  No styles available. Create a style in the Designer role first.
                </p>
              )}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};
