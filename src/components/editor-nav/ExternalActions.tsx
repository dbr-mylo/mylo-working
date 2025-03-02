
import { Button } from "@/components/ui/button";
import { Download, Share2, LogOut } from "lucide-react";

interface ExternalActionsProps {
  onSignOut?: () => void;
  isAuthenticated: boolean;
}

export const ExternalActions = ({ onSignOut, isAuthenticated }: ExternalActionsProps) => {
  return (
    <>
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <Share2 className="w-4 h-4" />
        Share
      </Button>
      
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        Export
      </Button>
      
      {isAuthenticated && onSignOut && (
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      )}
    </>
  );
};
