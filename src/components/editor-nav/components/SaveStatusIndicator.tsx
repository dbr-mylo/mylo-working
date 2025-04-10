
import React from "react";
import { Clock, CloudOff, Check, SaveIcon, XCircle } from "lucide-react";
import { SaveStatus } from "@/hooks/useAutosave";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  lastSaved: Date | null;
}

export function SaveStatusIndicator({ status, lastSaved }: SaveStatusIndicatorProps) {
  // Format the last saved time
  const formattedTime = lastSaved 
    ? lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;
  
  const getStatusDisplay = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <SaveIcon className="h-4 w-4 animate-pulse" />,
          text: "Saving...",
          tooltipText: "Saving your changes..."
        };
      case 'saved':
        return {
          icon: <Check className="h-4 w-4 text-green-500" />,
          text: "Saved",
          tooltipText: formattedTime ? `Last saved at ${formattedTime}` : "All changes saved"
        };
      case 'error':
        return {
          icon: <XCircle className="h-4 w-4 text-red-500" />,
          text: "Error",
          tooltipText: "Could not save changes"
        };
      case 'offline':
        return {
          icon: <CloudOff className="h-4 w-4 text-amber-500" />,
          text: "Offline",
          tooltipText: "Changes will be saved when back online"
        };
      case 'idle':
      default:
        return {
          icon: formattedTime ? <Clock className="h-4 w-4 text-gray-500" /> : null,
          text: formattedTime ? `Saved at ${formattedTime}` : "No changes",
          tooltipText: formattedTime ? `Last saved at ${formattedTime}` : "No changes to save"
        };
    }
  };
  
  const { icon, text, tooltipText } = getStatusDisplay();
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
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
