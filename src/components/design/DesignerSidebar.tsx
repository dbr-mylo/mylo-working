
import { DesignerSidebarContainer } from "./DesignerSidebarContainer";
import { Card } from "@/components/ui/card";
import { Pilcrow, Check } from "lucide-react";
import { useEffect, useState, ReactNode } from "react";
import { textStyleStore } from "@/stores/textStyles";
import { TextStyle } from "@/lib/types";
import { EmptyState } from "./typography/EmptyState";

interface DesignerSidebarProps {
  children?: ReactNode;
}

export const DesignerSidebar = ({ children }: DesignerSidebarProps) => {
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
      {children}
      
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
                  
                  {/* Show visual indicators for isUsed and isDefault */}
                  <div className="flex ml-auto items-center space-x-1">
                    {style.isUsed && (
                      <span className="text-[10px] text-green-500 flex items-center" title="This style is used in documents">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    {style.isDefault && (
                      <span className="text-[10px] text-blue-500" title="Default style">Default</span>
                    )}
                  </div>
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
}
