
import React from "react";
import { RoleNavigation } from "./RoleNavigation";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";

/**
 * Wrapper component that ensures RoleNavigation has the required context providers
 * and proper navigation handling
 */
export const RoleNavigationWrapper = () => {
  const { navigateTo } = useNavigationHandlers();
  
  return (
    <ErrorBoundary context="RoleNavigationWrapper">
      <RoleNavigation navigateTo={navigateTo} />
    </ErrorBoundary>
  );
};
