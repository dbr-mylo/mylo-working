
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ToolbarButtonProps {
  icon: ReactNode;
  action: () => void;
  isActive: boolean;
  tooltip: string;
}

export const ToolbarButton = ({ icon, action, isActive, tooltip }: ToolbarButtonProps) => (
  <Button
    variant="outline"
    size="sm"
    onClick={action}
    className={`h-[30px] px-1.5 text-sm leading-[22px] ${isActive ? 'bg-accent' : ''}`}
    title={tooltip}
  >
    {icon}
  </Button>
);
