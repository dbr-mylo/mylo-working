
import { DesignerSidebarContainer } from "./DesignerSidebarContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const DesignerSidebar = () => {
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
      
      <DesignerSidebarContainer title="Settings">
        <p className="text-sm text-editor-text">No settings available yet</p>
      </DesignerSidebarContainer>
    </div>
  );
};
