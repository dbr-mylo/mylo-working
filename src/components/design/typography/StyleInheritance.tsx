
import { useState, useEffect } from "react";
import { TextStyle } from "@/lib/types";
import { textStyleStore } from "@/stores/textStyles";
import { Card } from "@/components/ui/card";
import { Pilcrow, GitBranch } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface StyleInheritanceProps {
  style: TextStyle;
  onStyleUpdated: () => void;
}

export const StyleInheritance = ({ style, onStyleUpdated }: StyleInheritanceProps) => {
  const [availableParents, setAvailableParents] = useState<TextStyle[]>([]);
  const [childStyles, setChildStyles] = useState<TextStyle[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string | undefined>(style.parentId);
  const { toast } = useToast();

  useEffect(() => {
    const loadStyles = async () => {
      try {
        // Get all styles except the current one and its descendants
        const allStyles = await textStyleStore.getTextStyles();
        const filteredStyles = allStyles.filter(s => 
          s.id !== style.id && 
          !isDescendantOf(allStyles, s.id, style.id)
        );
        setAvailableParents(filteredStyles);
        
        // Get child styles
        const children = await textStyleStore.getStylesWithParent(style.id);
        setChildStyles(children);
      } catch (error) {
        console.error("Error loading styles for inheritance:", error);
      }
    };
    
    loadStyles();
  }, [style.id]);

  // Check if styleId is a descendant of potentialAncestorId
  const isDescendantOf = (allStyles: TextStyle[], styleId: string, potentialAncestorId: string): boolean => {
    const style = allStyles.find(s => s.id === styleId);
    if (!style || !style.parentId) return false;
    if (style.parentId === potentialAncestorId) return true;
    return isDescendantOf(allStyles, style.parentId, potentialAncestorId);
  };

  const handleSetParent = async () => {
    try {
      // Make a copy of the style and update parentId
      const updatedStyle = {
        ...style,
        parentId: selectedParentId === "none" ? undefined : selectedParentId
      };
      
      await textStyleStore.saveTextStyle(updatedStyle);
      
      toast({
        title: "Style updated",
        description: "Parent style has been updated"
      });
      
      onStyleUpdated();
    } catch (error) {
      console.error("Error updating parent style:", error);
      toast({
        title: "Error",
        description: "Failed to update parent style",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Parent Style</h3>
        <div className="flex gap-2">
          <Select 
            value={selectedParentId || "none"} 
            onValueChange={setSelectedParentId}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select parent style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Parent</SelectItem>
              {availableParents.map(parent => (
                <SelectItem key={parent.id} value={parent.id}>
                  {parent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSetParent} size="sm">Update</Button>
        </div>
      </div>
      
      {childStyles.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Child Styles</h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {childStyles.map(childStyle => (
              <Card key={childStyle.id} className="p-2 flex items-center gap-2">
                <GitBranch className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs">{childStyle.name}</span>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
