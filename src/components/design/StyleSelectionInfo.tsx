
import { useEffect } from "react";
import { SelectedTextInfo } from "@/hooks/useStyleSelection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Paintbrush, Type, CursorText } from "lucide-react";
import { StyleApplicator } from "./typography/StyleApplicator";

interface StyleSelectionInfoProps {
  selectedInfo: SelectedTextInfo;
  onApplyStyle: (styleId: string) => Promise<boolean>;
  visible: boolean;
}

export const StyleSelectionInfo = ({ 
  selectedInfo, 
  onApplyStyle,
  visible
}: StyleSelectionInfoProps) => {
  if (!visible) return null;

  const { elementType, hasSelection, selectedText, isEmpty } = selectedInfo;
  
  // Element type badge color
  const getBadgeVariant = () => {
    switch (elementType) {
      case 'h1':
      case 'h2':
      case 'h3':
        return 'default';
      case 'p':
        return 'outline';
      case 'ul':
      case 'ol':
      case 'li':
        return 'secondary';
      case 'blockquote':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Truncate selected text for display
  const displayText = selectedText.length > 30 
    ? selectedText.substring(0, 30) + '...' 
    : selectedText;

  return (
    <div className="bg-white rounded-md border border-border p-3 text-sm animate-in fade-in">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Element:</span>
            <Badge variant={getBadgeVariant()}>
              {elementType || 'none'}
            </Badge>
          </div>
          
          {hasSelection ? (
            <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
              Text Selected
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-100">
              <CursorText className="h-3 w-3 mr-1" />
              Cursor Position
            </Badge>
          )}
        </div>
        
        {hasSelection && (
          <div className="mt-1 text-xs text-muted-foreground italic border-l-2 border-muted pl-2">
            "{displayText}"
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {hasSelection 
              ? "Apply style to selected text" 
              : "Apply style at cursor position"}
          </span>
          
          <StyleApplicator 
            onApplyStyle={onApplyStyle} 
            selectedElement={null} // We're using the editor instead of DOM elements
            isForEditor={true}
          />
        </div>
      </div>
    </div>
  );
};
