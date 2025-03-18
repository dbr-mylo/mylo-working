
import { ReactNode } from "react";

interface AuthTabsProps {
  activeTab: "signin" | "signup";
  onTabChange: (tab: "signin" | "signup") => void;
  isDisabled: boolean;
}

export const AuthTabs = ({
  activeTab,
  onTabChange,
  isDisabled
}: AuthTabsProps) => {
  return (
    <div className="auth-tabs-list" style={{ borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
      <button 
        className="auth-tab-trigger" 
        style={{ borderRadius: "0.375rem" }}
        data-state={activeTab === "signin" ? "active" : "inactive"}
        onClick={() => onTabChange("signin")}
        disabled={isDisabled}
        aria-disabled={isDisabled}
      >
        Sign In
      </button>
      <button 
        className="auth-tab-trigger" 
        style={{ borderRadius: "0.375rem" }}
        data-state={activeTab === "signup" ? "active" : "inactive"}
        onClick={() => onTabChange("signup")}
        disabled={isDisabled}
        aria-disabled={isDisabled}
      >
        Sign Up
      </button>
    </div>
  );
};
