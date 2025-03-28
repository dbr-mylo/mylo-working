
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CacheControls } from "@/components/auth/CacheControls";
import "../styles/auth.css";
import { handleError } from "@/utils/errorHandling";
import { ErrorDisplay } from "@/components/errors/ErrorDisplay";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, continueAsGuestWriter, continueAsGuestDesigner, continueAsGuestAdmin } = useAuth();

  const handleSubmit = async (action: "signin" | "signup") => {
    setError(null);
    setIsLoading(true);
    
    try {
      if (action === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error) {
      setError(error);
      handleError(
        error, 
        `Auth.${action}`, 
        action === "signin" ? "Failed to sign in" : "Failed to sign up"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary context="Auth">
      <div className="auth-container">
        <div className="auth-card">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-1">Welcome</h1>
            <p className="text-gray-500 mb-6">Sign in to access your documents</p>
            
            {error && (
              <ErrorDisplay 
                error={error} 
                context="authentication" 
                className="mb-4"
                onRetry={() => setError(null)}
              />
            )}
            
            <div>
              <div className="auth-tabs-list" style={{ borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
                <button 
                  className="auth-tab-trigger" 
                  style={{ borderRadius: "0.375rem" }}
                  data-state={activeTab === "signin" ? "active" : "inactive"}
                  onClick={() => setActiveTab("signin")}
                >
                  Sign In
                </button>
                <button 
                  className="auth-tab-trigger" 
                  style={{ borderRadius: "0.375rem" }}
                  data-state={activeTab === "signup" ? "active" : "inactive"}
                  onClick={() => setActiveTab("signup")}
                >
                  Sign Up
                </button>
              </div>
              
              {activeTab === "signin" && (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit("signin"); }} className="auth-form">
                  <div className="auth-input-group">
                    <label htmlFor="signin-email" className="auth-input-label">Email</label>
                    <input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-input-group">
                    <label htmlFor="signin-password" className="auth-input-label">Password</label>
                    <input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="auth-input"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="auth-submit-button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </button>
                </form>
              )}
              
              {activeTab === "signup" && (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit("signup"); }} className="auth-form">
                  <div className="auth-input-group">
                    <label htmlFor="signup-email" className="auth-input-label">Email</label>
                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-input-group">
                    <label htmlFor="signup-password" className="auth-input-label">Password</label>
                    <input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="auth-input"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="auth-submit-button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing Up..." : "Sign Up"}
                  </button>
                </form>
              )}
            </div>
            
            <div className="auth-divider">
              <span className="auth-divider-text">Or continue as guest</span>
            </div>
            
            <div className="auth-guest-buttons">
              <button
                onClick={() => continueAsGuestWriter()}
                className="auth-guest-button"
                disabled={isLoading}
              >
                Writer
              </button>
              <button
                onClick={() => continueAsGuestDesigner()}
                className="auth-guest-button"
                disabled={isLoading}
              >
                Designer
              </button>
              <button
                onClick={() => continueAsGuestAdmin()}
                className="auth-guest-button"
                disabled={isLoading}
              >
                Admin
              </button>
            </div>
            
            <CacheControls />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
