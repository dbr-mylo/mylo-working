
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";
import { useAuth } from "@/contexts/AuthContext";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface WriterDashboardHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/**
 * Header component for the writer dashboard
 * Extracted from WriterDashboard.tsx to reduce file size
 */
export const WriterDashboardHeader: React.FC<WriterDashboardHeaderProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  const { navigateTo } = useNavigationHandlers();
  const { user } = useAuth();
  
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Writer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back{user?.name ? `, ${user.name}` : ''}!</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigateTo('/help')}
            size="sm"
          >
            Help Center
          </Button>
          <Button 
            onClick={() => navigateTo('/editor')}
          >
            New Document
          </Button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search documents..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default WriterDashboardHeader;
