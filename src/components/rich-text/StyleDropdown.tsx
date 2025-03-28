
import { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTextStyles } from "@/components/design/typography/hooks/useTextStyles";
import { useStyleApplication } from "@/hooks/useStyleApplication";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Text, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { StyleListItem } from "@/components/design/typography/StyleListItem";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { handleError } from "@/utils/errorHandling";

interface StyleDropdownProps {
  editor: Editor;
}

export const StyleDropdown = ({ editor }: StyleDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { styles, isLoading, error } = useTextStyles();
  const { applyStyle } = useStyleApplication(editor);
  const { role } = useAuth();
  const isDesigner = role === "designer";
  const [hasSelection, setHasSelection] = useState(false);

  // Monitor selection state to enable/disable the dropdown
  useEffect(() => {
    const updateSelectionState = () => {
      try {
        if (editor) {
          setHasSelection(!editor.state.selection.empty);
        }
      } catch (err) {
        handleError(err, "StyleDropdown.updateSelectionState", null, false);
      }
    };

    // Check initial state
    updateSelectionState();

    // Listen for selection changes
    if (editor) {
      editor.on('selectionUpdate', updateSelectionState);
      return () => {
        editor.off('selectionUpdate', updateSelectionState);
      };
    }
  }, [editor]);

  const handleStyleSelect = (styleId: string) => {
    try {
      applyStyle(styleId);
      setIsOpen(false);
    } catch (err) {
      handleError(err, "StyleDropdown.handleStyleSelect", "Failed to apply style");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size={isDesigner ? "xxs" : "xs"}
          className={`${isDesigner ? 'h-7' : 'h-8'} gap-1 px-2 font-normal`}
          disabled={!hasSelection}
          title={!hasSelection ? "Select text to apply a style" : "Apply a text style"}
        >
          <Text className="h-3 w-3" />
          <span className="text-xs">Styles</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <h4 className="text-sm font-medium mb-2">Text Styles</h4>
        
        {!hasSelection && (
          <Alert variant="default" className="mb-2 py-2">
            <AlertTitle className="text-xs">No text selected</AlertTitle>
            <AlertDescription className="text-xs">
              Select some text in the editor first to apply a style.
            </AlertDescription>
          </Alert>
        )}
        
        {error ? (
          <Alert variant="destructive" className="py-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load styles: {error.message || "Unknown error"}
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
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
