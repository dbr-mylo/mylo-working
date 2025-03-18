
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CacheControls } from "@/components/auth/CacheControls";
import { AuthErrorBoundary } from "@/components/auth/AuthErrorBoundary";
import { useAuthErrorHandler } from "@/hooks/useAuthErrorHandler";
import { toast } from "sonner";
import { AuthFormState } from "@/lib/types/authTypes";
import "../styles/auth.css";

export default function Auth() {
  // Form state with proper typing
  const [formState, setFormState] = useState<AuthFormState>({
    email: "",
    password: "",
    isSubmitting: false,
    activeTab: "signin"
  });
  
  // Auth context with improved error handling
  const { 
    signIn, 
    signUp, 
    continueAsGuestEditor, 
    continueAsGuestDesigner, 
    continueAsGuestAdmin,
    isLoading,
    error,
    clearError
  } = useAuth();
  
  // Use the enhanced auth error handler
  const { 
    handleError, 
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

  // Handle input changes with type safety
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const field = id.split('-')[1]; // Extract field name from id (e.g., "signin-email" -> "email")
    
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle tab changes
  const handleTabChange = (tab: "signin" | "signup") => {
    setFormState(prev => ({
      ...prev,
      activeTab: tab,
      // Reset form errors on tab change
      isSubmitting: false
    }));
    clearError();
    clearHandlerError();
  };

  // Handle form submission with improved error handling and retry capability
  const handleSubmit = async (action: "signin" | "signup") => {
    try {
      // Validate form
      if (!formState.email) {
        toast.error("Email is required");
        return;
      }
      
      if (!formState.password) {
        toast.error("Password is required");
        return;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formState.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      
      // Basic password validation
      if (formState.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      
      // Set submitting state
      setFormState(prev => ({ ...prev, isSubmitting: true }));
      
      // Use the auth operation with retry capability if enabled
      if (action === "signin") {
        // Attempt sign in with retry support
        await retryOperation(() => signIn(formState.email, formState.password));
      } else {
        // Sign up typically doesn't need retries
        await signUp(formState.email, formState.password);
      }
    } catch (error) {
      // Use the error handler - convert the action to the proper AuthErrorType
      handleError(error, action === "signin" ? "signIn" : "signUp");
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Determine loading and error states
  const isAuthLoading = isLoading || formState.isSubmitting || isRetrying;

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
                  disabled={isAuthLoading}
                  aria-disabled={isAuthLoading}
                >
                  Sign In
                </button>
                <button 
                  className="auth-tab-trigger" 
                  style={{ borderRadius: "0.375rem" }}
                  data-state={formState.activeTab === "signup" ? "active" : "inactive"}
                  onClick={() => handleTabChange("signup")}
                  disabled={isAuthLoading}
                  aria-disabled={isAuthLoading}
                >
                  Sign Up
                </button>
              </div>
              
              {formState.activeTab === "signin" && (
                <form 
                  onSubmit={(e) => { 
                    e.preventDefault(); 
                    handleSubmit("signin"); 
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
                      disabled={isAuthLoading}
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
                      disabled={isAuthLoading}
                      aria-describedby="signin-password-error"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="auth-submit-button"
                    disabled={isAuthLoading}
                    aria-busy={isAuthLoading}
                  >
                    {isRetrying ? "Retrying..." : (isAuthLoading ? "Signing In..." : "Sign In")}
                  </button>
                </form>
              )}
              
              {formState.activeTab === "signup" && (
                <form 
                  onSubmit={(e) => { 
                    e.preventDefault(); 
                    handleSubmit("signup"); 
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
                      disabled={isAuthLoading}
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
                      disabled={isAuthLoading}
                      aria-describedby="signup-password-error"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="auth-submit-button"
                    disabled={isAuthLoading}
                    aria-busy={isAuthLoading}
                  >
                    {isAuthLoading ? "Signing Up..." : "Sign Up"}
                  </button>
                </form>
              )}
              
              {/* Add error display section */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  <p className="font-medium">Authentication Error</p>
                  <p>{error.message}</p>
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
                disabled={isAuthLoading}
              >
                Editor
              </button>
              <button
                onClick={continueAsGuestDesigner}
                className="auth-guest-button"
                disabled={isAuthLoading}
              >
                Designer
              </button>
              <button
                onClick={continueAsGuestAdmin}
                className="auth-guest-button"
                disabled={isAuthLoading}
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
