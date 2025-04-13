
import { 
  NavigationError, 
  NavigationErrorType 
} from '@/utils/navigation/types';
import { toast } from 'sonner';

/**
 * Navigation error handling functionality
 */
export class NavigationErrorHandler {
  /**
   * Handle navigation errors
   * @param error Navigation error
   */
  public handleNavigationError(error: NavigationError): void {
    // Log the error
    console.error('Navigation Error:', error);
    
    // Show toast notification with appropriate message
    switch (error.type) {
      case NavigationErrorType.UNAUTHORIZED:
        toast.error("Access Denied", {
          description: "You don't have permission to access this page",
          duration: 3000,
        });
        break;
      
      case NavigationErrorType.NOT_FOUND:
        toast.error("Page Not Found", {
          description: `The page "${error.path}" does not exist`,
          duration: 3000,
        });
        break;
      
      case NavigationErrorType.VALIDATION_ERROR:
        toast.error("Navigation Error", {
          description: error.message || "Invalid navigation request",
          duration: 3000,
        });
        break;
      
      default:
        toast.error("Navigation Error", {
          description: "There was a problem navigating to the requested page",
          duration: 3000,
        });
    }
  }
}
