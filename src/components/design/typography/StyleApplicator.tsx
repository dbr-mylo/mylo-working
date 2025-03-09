
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Paintbrush, Link2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StyleListItem } from "./StyleListItem";
import { useTextStyles } from "./hooks/useTextStyles";
import { Badge } from "@/components/ui/badge";

interface StyleApplicatorProps {
  onApplyStyle: (styleId: string) => void;
  selectedElement?: HTMLElement | null;
}

export const StyleApplicator = ({ onApplyStyle, selectedElement }: StyleApplicatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { styles, isLoading } = useTextStyles();

  if (!selectedElement) {
    return null;
  }

  const handleApplyStyle = (styleId: string) => {
    onApplyStyle(styleId);
    setIsOpen(false);
  };

  // Group styles by inheritance for better organization
  const organizeStylesByInheritance = () => {
    // Map parent IDs to their children
    const childrenMap: Record<string, string[]> = {};
    
    // First, identify all parent-child relationships
    styles.forEach(style => {
      if (style.parentId) {
        if (!childrenMap[style.parentId]) {
          childrenMap[style.parentId] = [];
        }
        childrenMap[style.parentId].push(style.id);
      }
    });
    
    return styles.map(style => {
      const hasChildren = childrenMap[style.id] && childrenMap[style.id].length > 0;
      return {
        ...style,
        hasChildren,
        isChild: !!style.parentId
      };
    });
  };

  const organizedStyles = organizeStylesByInheritance();

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
      <PopoverContent className="w-72 p-2">
        <h4 className="font-medium text-sm mb-2">Select Style to Apply</h4>
        <ScrollArea className="h-[300px] pr-3">
          <div className="space-y-1">
            {isLoading ? (
              <p className="text-xs text-center py-4 text-muted-foreground">
                Loading styles...
              </p>
            ) : organizedStyles.length > 0 ? (
              organizedStyles.map((style) => (
                <div key={style.id} className="group">
                  <StyleListItem 
                    style={style} 
                    onSelect={handleApplyStyle}
                  />
                  {style.parentId && (
                    <div className="ml-2 -mt-1 mb-1 flex items-center">
                      <Link2 className="h-3 w-3 text-muted-foreground mr-1" />
                      <span className="text-[10px] text-muted-foreground">
                        Inherits from: {styles.find(s => s.id === style.parentId)?.name || 'Unknown'}
                      </span>
                    </div>
                  )}
                </div>
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
