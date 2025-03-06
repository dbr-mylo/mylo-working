
import { cn } from "@/lib/utils";

interface ToolPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ToolPanel({ title, children, className }: ToolPanelProps) {
  return (
    <div className={cn("p-4 border-b border-gray-200", className)}>
      <h3 className="text-sm font-medium mb-3">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
