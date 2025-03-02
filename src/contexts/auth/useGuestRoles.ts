
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AuthState, UserRole } from "./types";

export function useGuestRoles(
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) {
  const navigate = useNavigate();

  const continueAsGuestEditor = () => {
    const role = "editor";
    // Store the guest role in localStorage for persistence
    localStorage.setItem('guestRole', role);
    setAuthState({
      user: null,
      role: role,
      isLoading: false
    });
    toast.success("Continuing as Editor");
    navigate("/");
  };

  const continueAsGuestDesigner = () => {
    const role = "designer";
    // Store the guest role in localStorage for persistence
    localStorage.setItem('guestRole', role);
    setAuthState({
      user: null,
      role: role,
      isLoading: false
    });
    toast.success("Continuing as Designer");
    navigate("/");
  };

  return {
    continueAsGuestEditor,
    continueAsGuestDesigner
  };
}
