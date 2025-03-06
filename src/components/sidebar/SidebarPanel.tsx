
import React from "react";
import { cn } from "@/lib/utils";

interface SidebarPanelProps {
  children?: React.ReactNode;
}

export const SidebarPanel = ({ children }: SidebarPanelProps) => {
  return (
    <div className="h-full w-72 border-l border-editor-border bg-editor-panel">
      <div className="flex h-full flex-col">
        <div className="border-b border-editor-border p-2">
          <span className="text-sm font-medium">Tools</span>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
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
