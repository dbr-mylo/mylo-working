
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthError } from "@/lib/errors/authErrors";

interface SignUpFormProps {
  email: string;
  password: string;
  isProcessing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (action: "signup") => Promise<void>;
}

export const SignUpForm = ({
  email,
  password,
  isProcessing,
  onInputChange,
  onSubmit
}: SignUpFormProps) => {
  return (
    <form 
      onSubmit={(e) => { 
        e.preventDefault(); 
        onSubmit("signup"); 
      }} 
      className="auth-form"
      aria-label="Sign up form"
    >
      <div className="auth-input-group">
        <label htmlFor="signup-email" className="auth-input-label">Email</label>
        <input
          id="signup-email"
          type="email"
          name="email"
          value={email}
          onChange={onInputChange}
          required
          className="auth-input"
          disabled={isProcessing}
          aria-describedby="signup-email-error"
        />
      </div>
      <div className="auth-input-group">
        <label htmlFor="signup-password" className="auth-input-label">Password</label>
        <input
          id="signup-password"
          type="password"
          name="password"
          value={password}
          onChange={onInputChange}
          required
          className="auth-input"
          disabled={isProcessing}
          aria-describedby="signup-password-error"
        />
      </div>
      <button 
        type="submit" 
        className="auth-submit-button"
        disabled={isProcessing}
        aria-busy={isProcessing}
      >
        {isProcessing ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
};
