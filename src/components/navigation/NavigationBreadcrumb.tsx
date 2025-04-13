
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";
import { getRouteConfig, getPathDescription } from "@/utils/navigation/routeUtils";
import { findParentRoutes } from "@/utils/navigation/config/routeRelationships";

interface NavigationBreadcrumbProps {
  maxItems?: number;
  showHomeIcon?: boolean;
  className?: string;
  separator?: React.ReactNode;
}

/**
 * NavigationBreadcrumb component that shows the current path in breadcrumb format
 * with proper parent-child relationship handling
 */
export const NavigationBreadcrumb: React.FC<NavigationBreadcrumbProps> = ({
  maxItems = 4,
  showHomeIcon = true,
  className = "",
  separator = <ChevronRight className="h-4 w-4" />
}) => {
  const location = useLocation();
  const { navigateTo } = useNavigationHandlers();
  
  const currentPath = location.pathname;
  
  // Generate breadcrumb items based on route hierarchy
  const breadcrumbItems = useMemo(() => {
    // Start with current path
    const currentRoute = getRouteConfig(currentPath);
    
    if (!currentRoute) {
      return [{ path: currentPath, label: getPathDescription(currentPath) }];
    }
    
    // Get parent routes
    const parentRoutes = findParentRoutes(currentPath);
    
    // Combine parent routes with current route
    const allRoutes = [
      ...parentRoutes,
      { path: currentPath, label: currentRoute.description }
    ];
    
    // If too many items, trim the middle
    if (allRoutes.length > maxItems) {
      const startItems = Math.ceil(maxItems / 2);
      const endItems = Math.floor(maxItems / 2) - 1; // -1 for ellipsis
      
      const trimmedRoutes = [
        ...allRoutes.slice(0, startItems),
        { path: "", label: "..." },
        ...allRoutes.slice(allRoutes.length - endItems)
      ];
      
      return trimmedRoutes;
    }
    
    return allRoutes;
  }, [currentPath, maxItems]);
  
  // Don't render if only one item (current page)
  if (breadcrumbItems.length <= 1 && currentPath === "/") {
    return null;
  }
  
  return (
    <Breadcrumb className={`mb-4 px-4 py-2 ${className}`}>
      <BreadcrumbList>
        {showHomeIcon && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink 
                asChild
                className="hover:text-primary transition-colors"
              >
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="p-1"
                  onClick={() => navigateTo("/")}
                >
                  <Home className="h-4 w-4" />
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              {separator}
            </BreadcrumbSeparator>
          </>
        )}
        
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path || `ellipsis-${index}`}>
            <BreadcrumbItem>
              {item.path ? (
                <BreadcrumbLink 
                  asChild 
                  className={`${currentPath === item.path ? 'font-medium' : 'hover:text-primary transition-colors'}`}
                >
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="px-2 py-1 h-auto"
                    onClick={() => item.path && navigateTo(item.path)}
                    disabled={currentPath === item.path}
                  >
                    {item.label}
                  </Button>
                </BreadcrumbLink>
              ) : (
                <span className="text-muted-foreground">{item.label}</span>
              )}
            </BreadcrumbItem>
            
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator>
                {separator}
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default NavigationBreadcrumb;
