
import React from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Wifi, WifiOff, RefreshCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NetworkStatusIndicatorProps {
  showLabel?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "subtle" | "prominent";
}

export const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
  showLabel = false,
  className = "",
  size = "md",
  variant = "subtle",
}) => {
  const { isOnline, isChecking, checkConnection } = useOnlineStatus({
    pollingInterval: 60000, // Check every minute
  });
  
  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  
  const containerClasses = {
    subtle: "text-muted-foreground hover:text-foreground transition-colors",
    prominent: isOnline 
      ? "text-green-500 dark:text-green-400" 
      : "text-red-500 dark:text-red-400",
  };
  
  const handleManualCheck = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    checkConnection();
  };
  
  const renderContent = () => (
    <div 
      className={cn(
        "flex items-center gap-1.5 cursor-pointer",
        containerClasses[variant],
        className
      )}
      onClick={handleManualCheck}
      role="status"
      aria-live="polite"
    >
      {isOnline ? (
        <Wifi className={iconSizes[size]} />
      ) : (
        <WifiOff className={iconSizes[size]} />
      )}
      
      {isChecking && (
        <RefreshCcw className={cn(iconSizes[size], "animate-spin")} />
      )}
      
      {showLabel && (
        <span className={size === "sm" ? "text-xs" : "text-sm"}>
          {isOnline ? "Online" : "Offline"}
        </span>
      )}
    </div>
  );
  
  if (!showLabel) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {renderContent()}
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isOnline 
                ? "You're online" 
                : "You're currently offline"
              }
              {isChecking && " - Checking connection..."}
            </p>
            <p className="text-xs text-muted-foreground">Click to check status</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return renderContent();
};
