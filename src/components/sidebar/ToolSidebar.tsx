
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolSidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function ToolSidebar({ children, className }: ToolSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div 
      className={cn(
        "h-full bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-12" : "w-80",
        className
      )}
    >
      <div className="flex items-center justify-end p-2 border-b border-gray-200">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className={cn(
        "flex-1 overflow-auto transition-opacity",
        collapsed ? "opacity-0" : "opacity-100"
      )}>
        {!collapsed && children}
      </div>
    </div>
  );
}
