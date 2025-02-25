
import { ReactNode } from "react";

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
}

export const ButtonGroup = ({ children, className = "" }: ButtonGroupProps) => (
  <div className={`flex items-center gap-1 border-r border-editor-border pr-2 ${className}`}>
    {children}
  </div>
);
