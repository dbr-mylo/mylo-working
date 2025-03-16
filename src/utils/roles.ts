
import { UserRole } from "@/lib/types";

export const useIsAdmin = () => {
  // This is a simple implementation for now
  // It can be expanded based on your authentication logic
  const isAdmin = (role: UserRole | null): boolean => {
    return role === "admin";
  };
  
  return isAdmin;
};
