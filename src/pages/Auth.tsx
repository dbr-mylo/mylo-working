
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CacheControls } from "@/components/auth/CacheControls";
import { AuthErrorBoundary } from "@/components/auth/AuthErrorBoundary";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useAuthErrorHandler } from "@/hooks/useAuthErrorHandler";
import { AuthError } from "@/lib/errors/authErrors";
import "../styles/auth.css";

export default function Auth() {
  // Use the custom auth form hook for form state and handlers
  const {
    formState,
    isAuthLoading,
    handleInputChange,
    handleTabChange,
    handleSubmit
  } = useAuthForm();
  
  // Get guest role functions from auth context
  const { 
    continueAsGuestEditor, 
    continueAsGuestDesigner, 
    continueAsGuestAdmin,
    error,
    clearError
  } = useAuth();
  
  // Use the enhanced auth error handler
  const { 
    retryOperation, 
    isRetrying, 
    clearError: clearHandlerError 
  } = useAuthErrorHandler({
    showToast: true,
    logToConsole: true,
    retryCount: 1
  });

  // Clear auth errors when component unmounts or tab changes
  useEffect(() => {
    return () => {
      clearError();
      clearHandlerError();
    };
  }, [clearError, clearHandlerError, formState.activeTab]);

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

  // Determine loading and error states
  const isFormProcessing = isAuthLoading || isRetrying;

  return (
    <AuthErrorBoundary>
      <div className="auth-container">
        <div className="auth-card">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-1">Welcome</h1>
            <p className="text-gray-500 mb-6">Sign in to access your documents</p>
            
            <div>
              <div className="auth-tabs-list" style={{ borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
                <button 
                  className="auth-tab-trigger" 
                  style={{ borderRadius: "0.375rem" }}
                  data-state={formState.activeTab === "signin" ? "active" : "inactive"}
                  onClick={() => handleTabChange("signin")}
                  disabled={isFormProcessing}
                  aria-disabled={isFormProcessing}
                >
                  Sign In
                </button>
                <button 
                  className="auth-tab-trigger" 
                  style={{ borderRadius: "0.375rem" }}
                  data-state={formState.activeTab === "signup" ? "active" : "inactive"}
                  onClick={() => handleTabChange("signup")}
                  disabled={isFormProcessing}
                  aria-disabled={isFormProcessing}
                >
                  Sign Up
                </button>
              </div>
              
              {formState.activeTab === "signin" && (
                <form 
                  onSubmit={(e) => { 
                    e.preventDefault(); 
                    handleFormSubmit("signin"); 
                  }} 
                  className="auth-form"
                  aria-label="Sign in form"
                >
                  <div className="auth-input-group">
                    <label htmlFor="signin-email" className="auth-input-label">Email</label>
                    <input
                      id="signin-email"
                      type="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      required
                      className="auth-input"
                      disabled={isFormProcessing}
                      aria-describedby="signin-email-error"
                    />
                  </div>
                  <div className="auth-input-group">
                    <label htmlFor="signin-password" className="auth-input-label">Password</label>
                    <input
                      id="signin-password"
                      type="password"
                      value={formState.password}
                      onChange={handleInputChange}
                      required
                      className="auth-input"
                      disabled={isFormProcessing}
                      aria-describedby="signin-password-error"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="auth-submit-button"
                    disabled={isFormProcessing}
                    aria-busy={isFormProcessing}
                  >
                    {isRetrying ? "Retrying..." : (isFormProcessing ? "Signing In..." : "Sign In")}
                  </button>
                </form>
              )}
              
              {formState.activeTab === "signup" && (
                <form 
                  onSubmit={(e) => { 
                    e.preventDefault(); 
                    handleFormSubmit("signup"); 
                  }} 
                  className="auth-form"
                  aria-label="Sign up form"
                >
                  <div className="auth-input-group">
                    <label htmlFor="signup-email" className="auth-input-label">Email</label>
                    <input
                      id="signup-email"
                      type="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      required
                      className="auth-input"
                      disabled={isFormProcessing}
                      aria-describedby="signup-email-error"
                    />
                  </div>
                  <div className="auth-input-group">
                    <label htmlFor="signup-password" className="auth-input-label">Password</label>
                    <input
                      id="signup-password"
                      type="password"
                      value={formState.password}
                      onChange={handleInputChange}
                      required
                      className="auth-input"
                      disabled={isFormProcessing}
                      aria-describedby="signup-password-error"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="auth-submit-button"
                    disabled={isFormProcessing}
                    aria-busy={isFormProcessing}
                  >
                    {isFormProcessing ? "Signing Up..." : "Sign Up"}
                  </button>
                </form>
              )}
              
              {/* Add error display section */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  <p className="font-medium">Authentication Error</p>
                  <p>{error instanceof AuthError ? error.getUserMessage() : error.message}</p>
                  <button 
                    onClick={clearError}
                    className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
            
            <div className="auth-divider">
              <span className="auth-divider-text">Or continue as guest</span>
            </div>
            
            <div className="auth-guest-buttons">
              <button
                onClick={continueAsGuestEditor}
                className="auth-guest-button"
                disabled={isFormProcessing}
              >
                Editor
              </button>
              <button
                onClick={continueAsGuestDesigner}
                className="auth-guest-button"
                disabled={isFormProcessing}
              >
                Designer
              </button>
              <button
                onClick={continueAsGuestAdmin}
                className="auth-guest-button"
                disabled={isFormProcessing}
              >
                Admin
              </button>
            </div>
            
            <CacheControls />
          </div>
        </div>
      </div>
    </AuthErrorBoundary>
  );
}
