
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";
import { PlusIcon, Bell, Settings, User } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NetworkStatusIndicator } from "@/components/status/NetworkStatusIndicator";
import { Separator } from "@/components/ui/separator";

interface DashboardNavProps {
  onSearch?: (query: string) => void;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({ onSearch }) => {
  const { user } = useAuth();
  const { navigateTo } = useNavigationHandlers();
  
  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    }
  };
  
  return (
    <div className="flex items-center justify-between border-b border-border bg-background p-4">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <div className="ml-6 relative w-64">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search documents..."
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <NetworkStatusIndicator className="mr-1" />
        
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigateTo("/editor")}
                className="text-primary hover:bg-accent hover:text-accent-foreground"
              >
                <PlusIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create New Document</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <ThemeToggle variant="icon" size="sm" />
        
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center">
          {user && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {user.email?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
              </div>
              <span className="text-sm font-medium hidden md:inline text-foreground">
                {user.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
