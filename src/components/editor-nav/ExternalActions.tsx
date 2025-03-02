
import { Button } from "@/components/ui/button";
import { LogOut, FileText, Save, X, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface ExternalActionsProps {
  onSignOut?: () => void;
  isAuthenticated: boolean;
  onReturnToLogin?: () => void;
  onSave?: () => Promise<void>;
  onClose?: () => Promise<void>;
  onOpen?: () => void;
}

export const ExternalActions = ({ 
  onSignOut, 
  isAuthenticated,
  onReturnToLogin,
  onSave,
  onClose,
  onOpen
}: ExternalActionsProps) => {
  const navigate = useNavigate();
  
  const handleReturnToLogin = () => {
    if (isAuthenticated && onSignOut) {
      // If authenticated, sign out first
      onSignOut();
    } else if (onReturnToLogin) {
      // Use the provided handler if available
      onReturnToLogin();
    } else {
      // Fallback: directly navigate to auth page
      navigate("/auth");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="h-9 w-9"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {onOpen && (
          <DropdownMenuItem onClick={onOpen} className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            <span>Open</span>
          </DropdownMenuItem>
        )}
        
        {onSave && (
          <DropdownMenuItem onClick={onSave} className="cursor-pointer">
            <Save className="mr-2 h-4 w-4" />
            <span>Save</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleReturnToLogin} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Return to Login</span>
        </DropdownMenuItem>
        
        {isAuthenticated && onSignOut && (
          <DropdownMenuItem onClick={onSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        )}
        
        {onClose && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onClose} className="cursor-pointer text-destructive">
              <X className="mr-2 h-4 w-4" />
              <span>Close</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
