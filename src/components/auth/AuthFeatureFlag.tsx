import { createContext, useContext } from "react";

// Simplified context now that we no longer toggle between implementations
interface AuthFeatureFlagsContextType {
  useTestAuth: false;
}

const AuthFeatureFlagsContext = createContext<AuthFeatureFlagsContextType>({
  useTestAuth: false
});

export const AuthFeatureFlagsProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthFeatureFlagsContext.Provider value={{ useTestAuth: false }}>
      {children}
    </AuthFeatureFlagsContext.Provider>
  );
};

export const useAuthFeatureFlags = () => {
  const context = useContext(AuthFeatureFlagsContext);
  if (context === undefined) {
    throw new Error("useAuthFeatureFlags must be used within an AuthFeatureFlagsProvider");
  }
  return context;
};
