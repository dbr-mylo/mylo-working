import { useState } from "react";
import { Editor } from "@tiptap/react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTextStyles } from "@/components/design/typography/hooks/useTextStyles";
import { useStyleApplication } from "@/hooks/useStyleApplication";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Text } from "lucide-react";

interface StyleDropdownProps {
  editor: Editor;
}

export const StyleDropdown = ({ editor }: StyleDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { styles, isLoading } = useTextStyles();
  const { applyStyleToSelection } = useStyleApplication(editor);

  const handleStyleSelect = (styleId: string) => {
    applyStyleToSelection(styleId);
    setIsOpen(false);
  };

  const defaultStyle = styles.find(s => s.isDefault);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 gap-1 px-2 font-normal"
        >
          <Text className="h-3.5 w-3.5" />
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
                <>
                  {defaultStyle && (
                    <Button
                      key={defaultStyle.id}
                      variant="secondary"
                      size="sm"
                      className="w-full justify-start font-normal mb-2"
                      onClick={() => handleStyleSelect(defaultStyle.id)}
                    >
                      <div 
                        className="w-full overflow-hidden text-ellipsis"
                        style={{ 
                          fontFamily: defaultStyle.fontFamily,
                          fontWeight: defaultStyle.fontWeight,
                          color: defaultStyle.color
                        }}
                      >
                        {defaultStyle.name} (Default)
                      </div>
                    </Button>
                  )}

                  {styles.filter(style => !style.isDefault).map((style) => (
                    <Button
                      key={style.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start font-normal"
                      onClick={() => handleStyleSelect(style.id)}
                    >
                      <div 
                        className="w-full overflow-hidden text-ellipsis"
                        style={{ 
                          fontFamily: style.fontFamily,
                          fontWeight: style.fontWeight,
                          color: style.color
                        }}
                      >
                        {style.name}
                      </div>
                    </Button>
                  ))}
                </>
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
