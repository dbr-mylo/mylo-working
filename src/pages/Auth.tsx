
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import "../styles/auth.css";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const { signIn, signUp, continueAsGuestEditor, continueAsGuestDesigner } = useAuth();

  const handleSubmit = async (action: "signin" | "signup") => {
    try {
      if (action === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  return (
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
                >
                  Sign In
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
                >
                  Sign Up
                </button>
              </form>
            )}
          </div>
          
          <div className="auth-divider">
            <span className="auth-divider-text">Or continue as guest</span>
          </div>
          
          <div className="auth-guest-buttons">
            <button
              onClick={continueAsGuestEditor}
              className="auth-guest-button"
            >
              Editor
            </button>
            <button
              onClick={continueAsGuestDesigner}
              className="auth-guest-button"
            >
              Designer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
