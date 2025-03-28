
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log the 404 error to help with debugging
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Show a toast notification
    toast.error("Page not found", {
      description: `The page ${location.pathname} does not exist.`,
      icon: <AlertCircle className="h-5 w-5" />,
    });
    
    // This would be where you could log to an analytics service
    // Example: analytics.logEvent('404_error', { path: location.pathname });
  }, [location.pathname]);

  return (
    <ErrorBoundary context="NotFoundPage">
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-6">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Attempted path: <span className="font-mono">{location.pathname}</span>
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => window.history.back()} variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Button asChild>
                <a href="/">Return Home</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default NotFound;
