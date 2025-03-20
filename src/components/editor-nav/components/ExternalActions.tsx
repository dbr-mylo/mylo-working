
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ExternalActionsProps {
  onSignOut?: () => void;
  isAuthenticated: boolean;
}

export const ExternalActions = ({ onSignOut, isAuthenticated }: ExternalActionsProps) => {
  const { role, isAuthenticated: contextIsAuthenticated } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {(isAuthenticated || contextIsAuthenticated) && onSignOut && (
        <Button 
          variant="default" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      )}
    </div>
  );
};
