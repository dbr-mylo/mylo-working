
import { DesignerSidebarContainer } from "./DesignerSidebarContainer";
import { Card } from "@/components/ui/card";
import { Palette, Type } from "lucide-react";
import { useEffect, useState } from "react";
import { textStyleStore } from "@/stores/textStyleStore";
import { TextStyle } from "@/lib/types";
import { EmptyState } from "./typography/EmptyState";

export const DesignerSidebar = () => {
  const [textStyles, setTextStyles] = useState<TextStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTextStyles = async () => {
      try {
        const styles = await textStyleStore.getTextStyles();
        setTextStyles(styles);
      } catch (error) {
        console.error("Error loading text styles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTextStyles();
  }, []);

  return (
    <div className="w-64 bg-editor-sidebar border-l border-editor-border p-4">
      <DesignerSidebarContainer 
        title="Tools" 
        menuOptions={[
          { label: "Reset", onClick: () => console.log("Reset clicked") },
          { label: "Help", onClick: () => console.log("Help clicked") }
        ]}
      >
        <div className="space-y-2">
          <p className="text-sm text-editor-text">Select a tool to begin</p>
          <Card className="p-2 hover:bg-accent cursor-pointer">
            <span className="text-sm">Typography</span>
          </Card>
          <Card className="p-2 hover:bg-accent cursor-pointer">
            <span className="text-sm">Layout</span>
          </Card>
        </div>
      </DesignerSidebarContainer>
      
      <DesignerSidebarContainer 
        title="Styles" 
        menuOptions={[
          { label: "New Style", onClick: () => console.log("New style clicked") }
        ]}
      >
        {isLoading ? (
          <p className="text-sm text-editor-text py-2">Loading styles...</p>
        ) : textStyles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {textStyles.map((style) => (
              <Card 
                key={style.id} 
                className="p-2 hover:bg-accent cursor-pointer"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{style.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {style.fontFamily}, {style.fontSize}, {style.color}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </DesignerSidebarContainer>
      
      <DesignerSidebarContainer title="Settings">
        <p className="text-sm text-editor-text">No settings available yet</p>
      </DesignerSidebarContainer>
    </div>
  );
};
