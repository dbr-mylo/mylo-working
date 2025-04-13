
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";
import { navigationService } from "@/services/navigation/NavigationService";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Star } from "lucide-react";

interface NavigationSuggestionsProps {
  count?: number;
  title?: string;
  showFrequentlyVisited?: boolean;
}

/**
 * Component that shows role-specific navigation suggestions
 */
export const NavigationSuggestions: React.FC<NavigationSuggestionsProps> = ({
  count = 5,
  title = "Suggested Pages",
  showFrequentlyVisited = true
}) => {
  const { role } = useAuth();
  const { navigateTo } = useNavigationHandlers();
  
  // Get role-specific suggested routes
  const suggestedRoutes = navigationService.getRoleSuggestedRoutes(role, count);
  
  // Get frequently visited routes if enabled
  const frequentRoutes = showFrequentlyVisited 
    ? navigationService.getMostFrequentRoutes(3)
    : [];
    
  if (suggestedRoutes.length === 0 && frequentRoutes.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Role-specific suggestions */}
          {suggestedRoutes.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-3 text-gray-500 flex items-center">
                <LayoutDashboard className="h-4 w-4 mr-1" /> For You
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedRoutes.map((route, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto py-2 px-3"
                    onClick={() => navigateTo(route.path)}
                  >
                    {route.description}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Frequently visited routes */}
          {showFrequentlyVisited && frequentRoutes.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-3 text-gray-500 flex items-center">
                <Star className="h-4 w-4 mr-1" /> Frequently Visited
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {frequentRoutes.map((route, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-start text-left h-auto py-2 px-3"
                    onClick={() => navigateTo(route.path)}
                  >
                    {route.path}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NavigationSuggestions;
