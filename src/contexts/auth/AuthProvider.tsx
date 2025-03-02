
import { createContext, useContext } from "react";
import { useAuthState } from "./useAuthState";
import { useAuthMethods } from "./useAuthMethods";
import { useGuestRoles } from "./useGuestRoles";
import type { AuthContextType } from "./types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // We need to create these hooks in a specific order due to dependencies
  const { authState, setAuthState } = useAuthState((userId) => fetchUserData(userId));
  const { fetchUserData, signIn, signUp, signOut } = useAuthMethods(setAuthState);
  const { continueAsGuestEditor, continueAsGuestDesigner } = useGuestRoles(setAuthState);

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      signIn, 
      signUp, 
      signOut, 
      continueAsGuestEditor, 
      continueAsGuestDesigner 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
