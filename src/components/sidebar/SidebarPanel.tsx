
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarPanelProps {
  children?: React.ReactNode;
}

export const SidebarPanel = ({ children }: SidebarPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "h-full border-l border-editor-border bg-editor-panel transition-all duration-300 ease-in-out",
        isCollapsed ? "w-12" : "w-72"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-editor-border p-2">
          {!isCollapsed && <span className="text-sm font-medium">Tools</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn("h-8 w-8", isCollapsed && "mx-auto")}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </Button>
        </div>
        
        <div className={cn("flex-1 overflow-auto p-4", isCollapsed && "hidden")}>
          {children || (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No tools available yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
