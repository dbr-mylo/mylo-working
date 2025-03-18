
import { Error } from "@/lib/errors/authErrors";
import { AuthError } from "@/lib/errors/authErrors";

interface AuthErrorProps {
  error: Error | null;
  onClear: () => void;
}

export const AuthErrorDisplay = ({ error, onClear }: AuthErrorProps) => {
  if (!error) return null;
  
  return (
    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
      <p className="font-medium">Authentication Error</p>
      <p>{error instanceof AuthError ? error.getUserMessage() : error.message}</p>
      <button 
        onClick={onClear}
        className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
      >
        Dismiss
      </button>
    </div>
  );
};
