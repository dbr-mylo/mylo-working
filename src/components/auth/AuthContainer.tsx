
import React from "react";

interface AuthContainerProps {
  children: React.ReactNode;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
