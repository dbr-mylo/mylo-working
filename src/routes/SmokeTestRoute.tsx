
import React from "react";
import { SmokeTestDashboard } from "@/components/testing/SmokeTestDashboard";
import { RoleAwareLayout } from "@/components/layout/RoleAwareLayout";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Route component for the smoke test dashboard
 */
const SmokeTestRoute = () => {
  const { role } = useAuth();
  
  return (
    <RoleAwareLayout role={role} showRoleNavigation={false}>
      <SmokeTestDashboard />
    </RoleAwareLayout>
  );
};

export default SmokeTestRoute;
