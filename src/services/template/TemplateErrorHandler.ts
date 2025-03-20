
import { toast } from "sonner";

/**
 * Error handler for template operations
 * Provides consistent error handling and user feedback
 */
export class TemplateErrorHandler {
  /**
   * Handle errors from template operations
   */
  handleError(operation: string, error: unknown): void {
    console.error(`Error ${operation}:`, error);
    toast.error(`Failed to ${operation}`);
  }
  
  /**
   * Handle successful template operations with toast notifications
   */
  handleSuccess(operation: string, templateName?: string): void {
    const message = templateName 
      ? `Template "${templateName}" ${operation}`
      : `Template ${operation}`;
      
    toast.success(message);
  }
}

export const templateErrorHandler = new TemplateErrorHandler();
