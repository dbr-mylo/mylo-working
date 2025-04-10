
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
    <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        <div className="ml-6 relative w-64">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search documents..."
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigateTo("/editor")}
                className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
              >
                <PlusIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create New Document</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
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
        
        <div className="w-px h-6 bg-gray-200 mx-2"></div>
        
        <div className="flex items-center">
          {user && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user.email?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
              </div>
              <span className="text-sm font-medium hidden md:inline">
                {user.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
