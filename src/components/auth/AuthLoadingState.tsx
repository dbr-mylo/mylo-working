
import React from "react";
import { Loader2 } from "lucide-react";

interface AuthLoadingStateProps {
  message?: string;
}

export const AuthLoadingState: React.FC<AuthLoadingStateProps> = ({ 
  message = "Authenticating..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};
