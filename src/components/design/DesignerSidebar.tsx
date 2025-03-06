
import { DesignerSidebarContainer } from "./DesignerSidebarContainer";
import { Card } from "@/components/ui/card";
import { Pilcrow } from "lucide-react";
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
        title="Styles" 
        menuOptions={[
          { label: "New Style", onClick: () => console.log("New style clicked") }
        ]}
      >
        {isLoading ? (
          <p className="text-xs text-editor-text py-1">Loading styles...</p>
        ) : textStyles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-0.5">
            {textStyles.map((style) => (
              <Card 
                key={style.id} 
                className="p-1 hover:bg-accent cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Pilcrow className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs">{style.name}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </DesignerSidebarContainer>
      
      <DesignerSidebarContainer title="Settings">
        <p className="text-xs text-editor-text">No settings available yet</p>
      </DesignerSidebarContainer>
    </div>
  );
};
