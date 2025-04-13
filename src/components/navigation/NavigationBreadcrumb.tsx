
import React from "react";
import { useLocation } from "react-router-dom";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";
import { getBreadcrumbTrail } from "@/utils/navigation/config/routeRelationships";
import { useAuth } from "@/contexts/AuthContext";

interface NavigationBreadcrumbProps {
  showHomeIcon?: boolean;
  maxItems?: number;
}

/**
 * Breadcrumb navigation component that builds a trail based on route relationships
 */
export const NavigationBreadcrumb: React.FC<NavigationBreadcrumbProps> = ({ 
  showHomeIcon = true,
  maxItems = 4
}) => {
  const location = useLocation();
  const { navigateTo } = useNavigationHandlers();
  const { role } = useAuth();
  
  // Get breadcrumb trail for current path
  const breadcrumbTrail = getBreadcrumbTrail(location.pathname);
  
  // Handle navigation
  const handleClick = (path: string) => {
    navigateTo(path);
  };
  
  // Limit items if needed
  const visibleItems = breadcrumbTrail.slice(0, maxItems);
  const hasHiddenItems = breadcrumbTrail.length > maxItems;
  
  if (breadcrumbTrail.length <= 1) {
    return null; // Don't show breadcrumbs for top-level pages
  }
  
  return (
    <Breadcrumb className="mb-4 px-4 py-2">
      <BreadcrumbList>
        {showHomeIcon && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => handleClick("/")}>
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        
        {hasHiddenItems && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink>...</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          
          return (
            <React.Fragment key={item.path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.description}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink onClick={() => handleClick(item.path)}>
                    {item.description}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default NavigationBreadcrumb;
