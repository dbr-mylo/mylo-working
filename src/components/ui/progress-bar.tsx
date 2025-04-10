
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

  /**
   * Accessibility description for screen readers
   */
  ariaLabel?: string;

  /**
   * ID for connecting label to progress bar
   */
  id?: string;
}

/**
 * ProgressBar component that displays progress with accessibility support
 * 
 * @component
 * @example
 * ```tsx
 * <ProgressBar 
 *   value={75} 
 *   label="Uploading file" 
 *   statusMessage="3 of 4 files processed"
 * />
 * ```
 */
export function ProgressBar({
  value,
  label,
  statusMessage,
  className,
  showPercentage = true,
  isIndeterminate = false,
  ariaLabel,
  id = `progress-${Math.random().toString(36).substring(2, 9)}`
}: ProgressBarProps) {
  // Ensure value is within 0-100 range
  const safeValue = Math.max(0, Math.min(100, value));
  const percentageValue = Math.round(safeValue);
  
  // Generate aria label if not provided
  const computedAriaLabel = ariaLabel || 
    `${label || 'Progress'}: ${percentageValue}%${statusMessage ? `. ${statusMessage}` : ''}`;
  
  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <label 
            htmlFor={id}
            className="text-sm font-medium text-gray-700"
            id={`${id}-label`}
          >
            {label}
          </label>
          {showPercentage && (
            <span 
              className="text-sm text-gray-500"
              aria-hidden="true"
            >
              {percentageValue}%
            </span>
          )}
        </div>
      )}
      
      <div className="relative">
        <Progress 
          value={safeValue} 
          className="h-2 w-full" 
          id={id}
          aria-labelledby={label ? `${id}-label` : undefined}
          aria-valuenow={isIndeterminate ? undefined : percentageValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${percentageValue}%`}
          aria-busy={isIndeterminate}
          aria-label={!label ? computedAriaLabel : undefined}
        />
        
        {isIndeterminate && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 transform">
            <Loader2 
              className="h-3 w-3 animate-spin text-primary" 
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      
      {statusMessage && (
        <p 
          className="text-xs text-gray-500 mt-1"
          id={`${id}-status`}
          aria-live="polite"
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
}
