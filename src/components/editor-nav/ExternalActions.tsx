
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface ExternalActionsProps {
  onSignOut?: () => void;
  isAuthenticated: boolean;
  onReturnToLogin?: () => void;
}

export const ExternalActions = ({ 
  onSignOut, 
  isAuthenticated,
  onReturnToLogin
}: ExternalActionsProps) => {
  return (
    <>
      {onReturnToLogin && (
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex items-center gap-2 font-medium shadow-sm"
          onClick={onReturnToLogin}
        >
          <LogOut className="w-4 h-4" />
          Return to Login
        </Button>
      )}
      
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
