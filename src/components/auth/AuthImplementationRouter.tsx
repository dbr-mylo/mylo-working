
import Auth from "@/pages/Auth";
import TestAuth from "@/pages/TestAuth";
import { useAuthFeatureFlags } from "./AuthFeatureFlag";

export const AuthImplementationRouter = () => {
  const { useTestAuth } = useAuthFeatureFlags();
  
  return useTestAuth ? <TestAuth /> : <Auth />;
};
