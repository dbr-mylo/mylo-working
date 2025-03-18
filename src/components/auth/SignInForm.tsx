
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthError } from "@/lib/errors/authErrors";

interface SignInFormProps {
  email: string;
  password: string;
  isProcessing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (action: "signin") => Promise<void>;
}

export const SignInForm = ({
  email,
  password,
  isProcessing,
  onInputChange,
  onSubmit
}: SignInFormProps) => {
  return (
    <form 
      onSubmit={(e) => { 
        e.preventDefault(); 
        onSubmit("signin"); 
      }} 
      className="auth-form"
      aria-label="Sign in form"
    >
      <div className="auth-input-group">
        <label htmlFor="signin-email" className="auth-input-label">Email</label>
        <input
          id="signin-email"
          type="email"
          name="email"
          value={email}
          onChange={onInputChange}
          required
          className="auth-input"
          disabled={isProcessing}
          aria-describedby="signin-email-error"
        />
      </div>
      <div className="auth-input-group">
        <label htmlFor="signin-password" className="auth-input-label">Password</label>
        <input
          id="signin-password"
          type="password"
          name="password"
          value={password}
          onChange={onInputChange}
          required
          className="auth-input"
          disabled={isProcessing}
          aria-describedby="signin-password-error"
        />
      </div>
      <button 
        type="submit" 
        className="auth-submit-button"
        disabled={isProcessing}
        aria-busy={isProcessing}
      >
        {isProcessing ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
};
