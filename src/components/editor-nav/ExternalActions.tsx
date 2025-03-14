
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface ExternalActionsProps {
  onSignOut?: () => void;
  isAuthenticated: boolean;
}

export const ExternalActions = ({ onSignOut, isAuthenticated }: ExternalActionsProps) => {
  return (
    <>
      {isAuthenticated && onSignOut && (
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 bg-black text-white hover:bg-black/80"
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      )}
    </>
  );
};
