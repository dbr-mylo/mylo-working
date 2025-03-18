
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CacheControls } from "@/components/auth/CacheControls";
import { AuthErrorBoundary } from "@/components/auth/AuthErrorBoundary";
import { useAuthForm } from "@/hooks/auth";
import { useAuthErrorHandler } from "@/hooks/useAuthErrorHandler";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { GuestRoleButtons } from "@/components/auth/GuestRoleButtons";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { AuthErrorDisplay } from "@/components/auth/AuthErrorDisplay";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { AuthLoadingState } from "@/components/auth/AuthLoadingState";
import { useAuthErrorDisplay } from "@/hooks/auth/useAuthErrorDisplay";
import "../styles/auth.css";

/**
 * TestAuth component - Test implementation of the Auth page using new UI components
 * This follows our change management guidelines by creating a test component first
 * before replacing the original implementation
 */
export default function TestAuth() {
  // Use the custom auth form hook for form state and handlers
  const {
    formState,
    isAuthLoading,
    handleInputChange,
    handleTabChange,
    handleSubmit
  } = useAuthForm();
  
  // Get auth context
  const { 
    error,
    clearError
  } = useAuth();
  
  // Use the enhanced auth error handler
  const { 
    retryOperation, 
    isRetrying, 
    clearError: clearHandlerError,
    cancelRetry
  } = useAuthErrorHandler({
    showToast: true,
    logToConsole: true,
    retryCount: 2,
    retryDelay: 1500
  });

  // Use the auth error display hook for managing error display
  const {
    dismissError,
    resetDismissedErrors
  } = useAuthErrorDisplay({
    error,
    clearError,
    autoHideDelay: 5000
  });

  // Clear auth errors when component unmounts or tab changes
  useEffect(() => {
    return () => {
      clearError();
      clearHandlerError();
      resetDismissedErrors();
      cancelRetry();
    };
  }, [clearError, clearHandlerError, resetDismissedErrors, cancelRetry, formState.activeTab]);

  // Enhanced form submission with retry capability
  const handleFormSubmit = async (action: "signin" | "signup") => {
    try {
      if (action === "signin") {
        // Attempt sign in with retry support
        await retryOperation(() => handleSubmit(action));
      } else {
        // Sign up typically doesn't need retries
        await handleSubmit(action);
      }
    } catch (err) {
      console.error(`${action} failed with error:`, err);
    }
  };

  // Handle retry of the last operation
  const handleRetry = () => {
    const action = formState.activeTab;
    handleFormSubmit(action);
  };

  // Determine loading and error states
  const isFormProcessing = isAuthLoading || isRetrying;

  return (
    <AuthErrorBoundary>
      <AuthContainer>
        <h1 className="text-2xl font-bold mb-1">Welcome</h1>
        <p className="text-gray-500 mb-6">Sign in to access your documents</p>
        
        <div>
          <AuthTabs 
            activeTab={formState.activeTab}
            onTabChange={handleTabChange}
            isDisabled={isFormProcessing}
          />
          
          {isFormProcessing && (
            <AuthLoadingState 
              message={formState.activeTab === "signin" ? "Signing in..." : "Creating account..."}
            />
          )}
          
          {!isFormProcessing && formState.activeTab === "signin" && (
            <SignInForm
              email={formState.email}
              password={formState.password}
              isProcessing={isFormProcessing}
              onInputChange={handleInputChange}
              onSubmit={handleFormSubmit}
            />
          )}
          
          {!isFormProcessing && formState.activeTab === "signup" && (
            <SignUpForm
              email={formState.email}
              password={formState.password}
              isProcessing={isFormProcessing}
              onInputChange={handleInputChange}
              onSubmit={handleFormSubmit}
            />
          )}
          
          <AuthErrorDisplay 
            error={error} 
            onClear={dismissError} 
            onRetry={handleRetry}
          />
        </div>
        
        <AuthDivider />
        
        <GuestRoleButtons isDisabled={isFormProcessing} />
        
        <CacheControls />
      </AuthContainer>
    </AuthErrorBoundary>
  );
}
