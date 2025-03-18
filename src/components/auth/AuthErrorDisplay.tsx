
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError } from "@/lib/errors/authErrors";

interface AuthErrorDisplayProps {
  error: Error | null;
  onClear: () => void;
}

export const AuthErrorDisplay: React.FC<AuthErrorDisplayProps> = ({
  error,
  onClear
}) => {
  if (!error) return null;
  
  const errorMessage = error instanceof AuthError
    ? error.getUserMessage()
    : error.message;
  
  return (
    <Alert variant="destructive" className="mt-4 mb-2">
      <div className="flex items-start justify-between">
        <AlertDescription className="text-sm mt-1">
          {errorMessage}
        </AlertDescription>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 rounded-full" 
          onClick={onClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </Alert>
  );
};
