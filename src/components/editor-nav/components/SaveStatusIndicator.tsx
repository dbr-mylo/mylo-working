
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
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          text: "Saving...",
          tooltipText: "Saving your changes...",
          color: "text-blue-500"
        };
      case 'retry':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          text: "Retrying...",
          tooltipText: "Save failed. Retrying...",
          color: "text-amber-500"
        };
      case 'saved':
        return {
          icon: <Check className="h-4 w-4 text-green-500" />,
          text: "Saved",
          tooltipText: formattedTime ? `Last saved at ${formattedTime}` : "All changes saved",
          color: "text-green-500"
        };
      case 'error':
        return {
          icon: <XCircle className="h-4 w-4 text-red-500" />,
          text: "Error",
          tooltipText: pendingChanges ? "Could not save changes. Click to retry." : "Could not save changes",
          color: "text-red-500",
          clickable: pendingChanges && !!onManualSave
        };
      case 'offline':
        return {
          icon: <CloudOff className="h-4 w-4 text-amber-500" />,
          text: pendingChanges ? "Offline (unsaved)" : "Offline",
          tooltipText: pendingChanges ? "Changes will be saved when back online" : "You're working offline",
          color: "text-amber-500"
        };
      case 'idle':
      default:
        if (pendingChanges) {
          return {
            icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
            text: "Unsaved changes",
            tooltipText: "You have unsaved changes",
            color: "text-amber-500"
          };
        }
        return {
          icon: formattedTime ? <Clock className="h-4 w-4 text-gray-500" /> : null,
          text: formattedTime ? `Saved at ${formattedTime}` : "No changes",
          tooltipText: formattedTime ? `Last saved at ${formattedTime}` : "No changes to save",
          color: "text-gray-500"
        };
    }
  };
  
  const { icon, text, tooltipText, color, clickable = false } = getStatusDisplay();
  
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
          aria-label={clickable ? "Retry save" : undefined}
        >
          {icon}
          <span className="hidden md:inline">{text}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
}
