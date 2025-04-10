
import React from "react";
import { RoleNavigation } from "./RoleNavigation";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";

/**
 * Wrapper component that ensures RoleNavigation has the required context providers
 */
export const RoleNavigationWrapper = () => {
  return (
    <ErrorBoundary context="RoleNavigationWrapper">
      <RoleNavigation />
    </ErrorBoundary>
  );
};
