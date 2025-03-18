
import { createContext, useContext, useState } from "react";

// Create a context for feature flags
interface AuthFeatureFlagsContextType {
  useTestAuth: boolean;
  toggleTestAuth: () => void;
}

const AuthFeatureFlagsContext = createContext<AuthFeatureFlagsContextType>({
  useTestAuth: true, // Changed default to true
  toggleTestAuth: () => {}
});

export const AuthFeatureFlagsProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize with TestAuth as the default
  const [useTestAuth, setUseTestAuth] = useState(true);
  
  const toggleTestAuth = () => {
    setUseTestAuth(prev => !prev);
  };
  
  return (
    <AuthFeatureFlagsContext.Provider value={{ useTestAuth, toggleTestAuth }}>
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

// Component to toggle between original and test implementation
export const AuthToggle = () => {
  const { useTestAuth, toggleTestAuth } = useAuthFeatureFlags();
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={toggleTestAuth}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
      >
        {useTestAuth ? "Use Original Auth" : "Use Test Auth"}
      </button>
    </div>
  );
};
