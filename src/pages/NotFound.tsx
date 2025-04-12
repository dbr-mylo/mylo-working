
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { AlertCircle, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/errors";
import { useAuth } from "@/contexts/AuthContext";
import { navigationService } from "@/services/navigation/NavigationService";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuth();
  
  // Get information from state if available
  const from = location.state?.from || "unknown";
  const errorMessage = location.state?.message || "The page does not exist.";
  
  useEffect(() => {
    // Log the 404 error to help with debugging
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      "From:", from,
      "Role:", role || "unauthenticated"
    );
    
    // Show a toast notification
    toast.error("Page not found", {
      description: `The page ${location.pathname} does not exist.`,
      icon: <AlertCircle className="h-5 w-5" />,
    });
    
    // This would be where you could log to an analytics service
    // Example: analytics.logEvent('404_error', { path: location.pathname });
  }, [location.pathname, from, role]);

  // Determine the best place to send the user back to using the navigation service
  const getHomeRoute = () => {
    return navigationService.getDefaultRoute(role);
  };

  return (
    <ErrorBoundary context="NotFoundPage">
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-3">
              {errorMessage}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Attempted path: <span className="font-mono">{location.pathname}</span>
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate(getHomeRoute())} 
                className="flex items-center gap-2 px-6"
                size="lg"
              >
                <LayoutDashboard className="h-4 w-4" />
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default NotFound;
