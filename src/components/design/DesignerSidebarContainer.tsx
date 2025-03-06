
import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DesignerSidebarContainerProps {
  title: string;
  menuOptions?: Array<{
    label: string;
    onClick: () => void;
  }>;
  children?: React.ReactNode;
}

export const DesignerSidebarContainer = ({
  title,
  menuOptions = [],
  children,
}: DesignerSidebarContainerProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-3 border border-editor-border rounded-md overflow-hidden">
      <div className="flex items-center justify-between bg-muted p-1.5">
        <h3 className="text-xs font-medium text-editor-heading">{title}</h3>
        
        {menuOptions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-6 w-6 inline-flex items-center justify-center rounded-md hover:bg-accent transition-colors">
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {menuOptions.map((option, index) => (
                <DropdownMenuItem 
                  key={index} 
                  onClick={option.onClick}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      {isOpen && (
        <div className="p-2">
          {children}
        </div>
      )}
    </div>
  );
};
