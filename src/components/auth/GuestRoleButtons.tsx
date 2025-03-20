
import { useAuth } from "@/contexts/AuthContext";

interface GuestRoleButtonsProps {
  isDisabled: boolean;
}

export const GuestRoleButtons = ({ isDisabled }: GuestRoleButtonsProps) => {
  const { 
    continueAsGuestEditor, 
    continueAsGuestDesigner 
  } = useAuth();

  return (
    <div className="auth-guest-buttons">
      <button
        onClick={continueAsGuestEditor}
        className="auth-guest-button"
        disabled={isDisabled}
      >
        Editor
      </button>
      <button
        onClick={continueAsGuestDesigner}
        className="auth-guest-button"
        disabled={isDisabled}
      >
        Designer
      </button>
    </div>
  );
};
