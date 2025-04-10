
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  /**
   * Current progress value (0-100)
   */
  value: number;
  
  /**
   * Optional label to display
   */
  label?: string;
  
  /**
   * Optional status message to display below the progress bar
   */
  statusMessage?: string;
  
  /**
   * Optional CSS class name
   */
  className?: string;
  
  /**
   * Whether to show the progress value as a percentage
   */
  showPercentage?: boolean;
  
  /**
   * Whether the operation is indeterminate (show spinner)
   */
  isIndeterminate?: boolean;
}

export function ProgressBar({
  value,
  label,
  statusMessage,
  className,
  showPercentage = true,
  isIndeterminate = false
}: ProgressBarProps) {
  // Ensure value is within 0-100 range
  const safeValue = Math.max(0, Math.min(100, value));
  
  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">{Math.round(safeValue)}%</span>
          )}
        </div>
      )}
      
      <div className="relative">
        <Progress 
          value={safeValue} 
          className="h-2 w-full" 
        />
        
        {isIndeterminate && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 transform">
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          </div>
        )}
      </div>
      
      {statusMessage && (
        <p className="text-xs text-gray-500 mt-1">{statusMessage}</p>
      )}
    </div>
  );
}
