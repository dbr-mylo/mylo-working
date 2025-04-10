
import React from "react";
import { 
  Clock, 
  CloudOff, 
  Check, 
  SaveIcon, 
  XCircle, 
  Loader2, 
  AlertCircle 
} from "lucide-react";
import { SaveStatus } from "@/hooks/useAutosave";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  lastSaved: Date | null;
  pendingChanges?: boolean;
  onManualSave?: () => void;
}

/**
 * SaveStatusIndicator displays the current save status with accessibility support
 * 
 * This component shows the document's save status (saving, saved, error, offline)
 * and provides appropriate visual and screen reader feedback.
 * 
 * @component
 * @example
 * ```tsx
 * <SaveStatusIndicator 
 *   status="saving" 
 *   lastSaved={new Date()} 
 *   pendingChanges={true}
 *   onManualSave={() => saveDocument()}
 * />
 * ```
 */
export function SaveStatusIndicator({ 
  status, 
  lastSaved,
  pendingChanges = false,
  onManualSave
}: SaveStatusIndicatorProps) {
  // Format the last saved time
  const formattedTime = lastSaved 
    ? lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;
  
  const getStatusDisplay = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />,
          text: "Saving...",
          tooltipText: "Saving your changes...",
          color: "text-blue-500",
          ariaLive: "polite" as const
        };
      case 'retry':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />,
          text: "Retrying...",
          tooltipText: "Save failed. Retrying...",
          color: "text-amber-500",
          ariaLive: "polite" as const
        };
      case 'saved':
        return {
          icon: <Check className="h-4 w-4 text-green-500" aria-hidden="true" />,
          text: "Saved",
          tooltipText: formattedTime ? `Last saved at ${formattedTime}` : "All changes saved",
          color: "text-green-500",
          ariaLive: "polite" as const
        };
      case 'error':
        return {
          icon: <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />,
          text: "Error",
          tooltipText: pendingChanges ? "Could not save changes. Click to retry." : "Could not save changes",
          color: "text-red-500",
          clickable: pendingChanges && !!onManualSave,
          ariaLive: "assertive" as const
        };
      case 'offline':
        return {
          icon: <CloudOff className="h-4 w-4 text-amber-500" aria-hidden="true" />,
          text: pendingChanges ? "Offline (unsaved)" : "Offline",
          tooltipText: pendingChanges ? "Changes will be saved when back online" : "You're working offline",
          color: "text-amber-500",
          ariaLive: "polite" as const
        };
      case 'idle':
      default:
        if (pendingChanges) {
          return {
            icon: <AlertCircle className="h-4 w-4 text-amber-500" aria-hidden="true" />,
            text: "Unsaved changes",
            tooltipText: "You have unsaved changes",
            color: "text-amber-500",
            ariaLive: "polite" as const
          };
        }
        return {
          icon: formattedTime ? <Clock className="h-4 w-4 text-gray-500" aria-hidden="true" /> : null,
          text: formattedTime ? `Saved at ${formattedTime}` : "No changes",
          tooltipText: formattedTime ? `Last saved at ${formattedTime}` : "No changes to save",
          color: "text-gray-500",
          ariaLive: "off" as const
        };
    }
  };
  
  const { icon, text, tooltipText, color, clickable = false, ariaLive } = getStatusDisplay();
  
  const handleClick = (e: React.MouseEvent) => {
    if (clickable && onManualSave) {
      e.stopPropagation();
      onManualSave();
    }
  };
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={cn(
            "flex items-center gap-1.5 text-xs", 
            color,
            clickable ? "cursor-pointer hover:underline" : ""
          )}
          onClick={handleClick}
          role={clickable ? "button" : undefined}
          aria-label={clickable ? "Retry save" : text}
          tabIndex={clickable ? 0 : undefined}
          onKeyDown={clickable ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onManualSave?.();
            }
          } : undefined}
        >
          {icon}
          <span className="hidden md:inline">{text}</span>
          <span 
            className="sr-only" 
            aria-live={ariaLive}
            aria-atomic="true"
          >
            {text}. {tooltipText}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
}
