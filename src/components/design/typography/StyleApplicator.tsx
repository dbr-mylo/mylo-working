
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Paintbrush, Link2, AlertTriangle } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StyleListItem } from "./StyleListItem";
import { useTextStyles } from "./hooks/useTextStyles";
import { Badge } from "@/components/ui/badge";
import { TextStyle } from "@/lib/types";
import { handleError } from "@/utils/errorHandling";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface StyleApplicatorProps {
  onApplyStyle: (styleId: string) => void;
  selectedElement?: HTMLElement | null;
}

export const StyleApplicator = ({ onApplyStyle, selectedElement }: StyleApplicatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { styles, isLoading, error: stylesError } = useTextStyles();
  const [organizedStyles, setOrganizedStyles] = useState<(TextStyle & { 
    hasChildren?: boolean, 
    isChild?: boolean, 
    parentName?: string 
  })[]>([]);
  
  // Process styles to show inheritance relationships
  useEffect(() => {
    try {
      if (!styles.length) return;
      
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
      
      const processed = styles.map(style => {
        const hasChildren = childrenMap[style.id] && childrenMap[style.id].length > 0;
        return {
          ...style,
          hasChildren,
          isChild: !!style.parentId,
          parentName: style.parentId ? styles.find(s => s.id === style.parentId)?.name : undefined
        };
      });
      
      setOrganizedStyles(processed);
    } catch (err) {
      handleError(err, "StyleApplicator.organizeStyles", "Failed to organize styles");
      setOrganizedStyles(styles);
    }
  }, [styles]);

  if (!selectedElement) {
    return null;
  }

  const handleApplyStyle = (style: TextStyle) => {
    try {
      // We extract the ID from the style object to maintain compatibility
      onApplyStyle(style.id);
      setIsOpen(false);
    } catch (err) {
      handleError(err, "StyleApplicator.handleApplyStyle", "Failed to apply style");
    }
  };

  // Function to render a style preview
  const renderStylePreview = (style: TextStyle & { parentName?: string }) => {
    return (
      <div key={style.id} className="group py-1">
        <StyleListItem 
          style={style} 
          onSelect={handleApplyStyle}
        />
        {style.parentId && style.parentName && (
          <div className="ml-2 -mt-0.5 mb-1 flex items-center">
            <Link2 className="h-3 w-3 text-muted-foreground mr-1" />
            <span className="text-[10px] text-muted-foreground">
              Inherits from: {style.parentName}
            </span>
          </div>
        )}
      </div>
    );
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
      <PopoverContent className="w-72 p-2">
        <h4 className="font-medium text-sm mb-2">Select Style to Apply</h4>
        
        {stylesError ? (
          <Alert variant="destructive" className="py-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load styles: {stylesError.message || "Unknown error"}
            </AlertDescription>
          </Alert>
        ) : (
          <ScrollArea className="h-[300px] pr-3">
            <div className="space-y-1">
              {isLoading ? (
                <p className="text-xs text-center py-4 text-muted-foreground">
                  Loading styles...
                </p>
              ) : organizedStyles.length > 0 ? (
                <>
                  {/* First show default styles */}
                  {organizedStyles.filter(s => s.isDefault).map(renderStylePreview)}
                  
                  {/* Then show parent styles (ones without parents) */}
                  {organizedStyles.filter(s => !s.parentId && !s.isDefault).map(renderStylePreview)}
                  
                  {/* Finally show child styles */}
                  {organizedStyles.filter(s => s.parentId && !s.isDefault).map(renderStylePreview)}
                </>
              ) : (
                <p className="text-xs text-center py-4 text-muted-foreground">
                  No styles available. Create a style first.
                </p>
              )}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};
