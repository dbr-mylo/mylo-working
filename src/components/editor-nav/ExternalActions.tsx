
import { Button } from "@/components/ui/button";
import { LogOut, UserCog } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/utils/roleSpecificRendering";

interface ExternalActionsProps {
  onSignOut?: () => void;
  isAuthenticated: boolean;
}

export const ExternalActions = ({ onSignOut, isAuthenticated }: ExternalActionsProps) => {
  const { role } = useAuth();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  const handleAdminPanel = () => {
    navigate("/admin");
  };

  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={handleAdminPanel}
        >
          <UserCog className="w-4 h-4" />
          Admin
        </Button>
      )}
      
      {isAuthenticated && onSignOut && (
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
