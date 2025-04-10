
import React from "react";
import { RoleNavigation } from "./RoleNavigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ErrorBoundary } from "@/components/errors/core/ErrorBoundary";

/**
 * Wrapper component that ensures RoleNavigation has the required context providers
 */
export const RoleNavigationWrapper = () => {
  return (
    <ErrorBoundary context="RoleNavigationWrapper">
      <SidebarProvider>
        <RoleNavigation />
      </SidebarProvider>
    </ErrorBoundary>
  );
};
