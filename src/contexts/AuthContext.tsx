
import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole } from "@/utils/navigation/types";

interface AuthContextType {
  user: any | null;
  role: UserRole;
  previousRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: UserRole) => void;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  role: null,
  previousRole: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  setRole: () => {}
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRoleState] = useState<UserRole>(null);
  const [previousRole, setPreviousRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate authentication loading
  useEffect(() => {
    const init = async () => {
      try {
        // Check local storage for user and role
        const savedRole = localStorage.getItem("userRole") as UserRole;
        if (savedRole) {
          setRoleState(savedRole);
          setUser({ id: "1", name: "Test User" });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
  }, []);
  
  const login = async (email: string, password: string) => {
    // For testing purposes, set a role based on email
    let roleToSet: UserRole = "writer";
    
    if (email.includes("admin")) {
      roleToSet = "admin";
    } else if (email.includes("designer")) {
      roleToSet = "designer";
    }
    
    setRole(roleToSet);
    setUser({ id: "1", name: "Test User", email });
  };
  
  const logout = async () => {
    setPreviousRole(role);
    setRoleState(null);
    setUser(null);
    localStorage.removeItem("userRole");
  };
  
  // Role setter that tracks previous role
  const setRole = (newRole: UserRole) => {
    setPreviousRole(role);
    setRoleState(newRole);
    
    if (newRole) {
      localStorage.setItem("userRole", newRole);
    } else {
      localStorage.removeItem("userRole");
    }
  };
  
  const value = {
    user,
    role,
    previousRole,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    setRole
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
