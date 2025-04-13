
import React, { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { getPathDescription } from "@/utils/navigation/routeConfig";

interface NavigationBreadcrumbProps {
  maxItems?: number;
  showHomeIcon?: boolean;
}

export const NavigationBreadcrumb: React.FC<NavigationBreadcrumbProps> = ({
  maxItems = 4,
  showHomeIcon = true,
}) => {
  const location = useLocation();
  
  // Generate breadcrumb items based on the current path
  const breadcrumbItems = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    // Start with home
    const items = [
      { path: '/', label: 'Home' }
    ];
    
    // Build up breadcrumb paths
    let currentPath = '';
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      const pathDescription = getPathDescription(currentPath);
      const label = pathDescription || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      items.push({
        path: currentPath,
        label
      });
    });
    
    return items;
  }, [location.pathname]);
  
  // Handle truncation if there are too many breadcrumbs
  const displayedItems = useMemo(() => {
    if (breadcrumbItems.length <= maxItems) {
      return breadcrumbItems;
    }
    
    // Always show the first and last items
    const firstItem = breadcrumbItems[0];
    const lastItems = breadcrumbItems.slice(-Math.min(maxItems - 1, 3));
    
    return [firstItem, { path: '', label: '...' }, ...lastItems];
  }, [breadcrumbItems, maxItems]);
  
  if (breadcrumbItems.length <= 1) {
    return null; // Don't render breadcrumbs if we're just at home
  }
  
  return (
    <Breadcrumb className="py-3 px-4 bg-muted/30">
      <BreadcrumbList>
        {displayedItems.map((item, index) => {
          const isLast = index === displayedItems.length - 1;
          
          // Handle ellipsis
          if (item.label === '...') {
            return (
              <React.Fragment key="ellipsis">
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            );
          }
          
          // Handle home with icon
          if (index === 0 && showHomeIcon) {
            return (
              <React.Fragment key={item.path}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={item.path}>
                      <Home className="h-4 w-4" />
                      <span className="sr-only">Home</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          }
          
          // Regular breadcrumb item
          return (
            <React.Fragment key={item.path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.path}>{item.label}</Link>
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
