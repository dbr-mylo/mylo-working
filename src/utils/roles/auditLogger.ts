
import { UserRole } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

// Types for role change events
export interface RoleChangeEvent {
  userId: string | null;
  previousRole: UserRole | null;
  newRole: UserRole | null;
  timestamp: number;
  source: 'login' | 'guest' | 'admin' | 'system';
  success: boolean;
  error?: string;
}

/**
 * Role change audit logger
 * Logs role change events for security and debugging
 */
export const roleAuditLogger = {
  /**
   * Log a role change event
   * @param event Role change event details
   */
  async logRoleChange(event: RoleChangeEvent): Promise<void> {
    try {
      // Log to console in development
      console.info('Role change:', {
        timestamp: new Date(event.timestamp).toISOString(),
        userId: event.userId || 'guest',
        from: event.previousRole || 'none',
        to: event.newRole || 'none',
        source: event.source,
        success: event.success,
        error: event.error
      });
      
      // In a production environment, we could also:
      // 1. Send to analytics/monitoring service
      // 2. Store in local storage for debugging
      // 3. Send to backend service
      
      // Store last 20 role changes in localStorage for debugging
      this.storeEventInLocalStorage(event);
    } catch (error) {
      console.error('Failed to log role change:', error);
    }
  },

  /**
   * Store event in localStorage
   * @param event Role change event
   */
  storeEventInLocalStorage(event: RoleChangeEvent): void {
    try {
      // Get existing logs
      const existingLogsJson = localStorage.getItem('role_change_logs');
      const existingLogs: RoleChangeEvent[] = existingLogsJson 
        ? JSON.parse(existingLogsJson) 
        : [];
      
      // Add new log and limit to last 20
      const updatedLogs = [event, ...existingLogs].slice(0, 20);
      
      // Save back to localStorage
      localStorage.setItem('role_change_logs', JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Failed to store role change in localStorage:', error);
    }
  },

  /**
   * Get role change history from localStorage
   * @returns Array of role change events
   */
  getRoleChangeHistory(): RoleChangeEvent[] {
    try {
      const logsJson = localStorage.getItem('role_change_logs');
      return logsJson ? JSON.parse(logsJson) : [];
    } catch (error) {
      console.error('Failed to retrieve role change history:', error);
      return [];
    }
  },

  /**
   * Clear role change history
   */
  clearRoleChangeHistory(): void {
    try {
      localStorage.removeItem('role_change_logs');
    } catch (error) {
      console.error('Failed to clear role change history:', error);
    }
  }
};
