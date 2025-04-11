
/**
 * Recovery strategies for different error types
 */
import { ErrorCategory } from '@/utils/error/errorClassifier';
import { verifyAndCleanBackups } from '@/utils/backup/documentBackupSystem';

export class RecoveryStrategies {
  private errorCounts: Record<string, number> = {};
  
  /**
   * Track errors by context
   * @param context Error context
   */
  private trackError(context: string): void {
    this.errorCounts[context] = (this.errorCounts[context] || 0) + 1;
  }
  
  /**
   * Reset error count for specific context
   * @param context Error context
   */
  public resetErrorCount(context: string): void {
    this.errorCounts[context] = 0;
  }
  
  /**
   * Reset all error tracking
   */
  public resetErrorTracking(): void {
    this.errorCounts = {};
  }
  
  /**
   * Get error count for specific context
   * @param context Error context
   */
  public getErrorCount(context: string): number {
    return this.errorCounts[context] || 0;
  }
  
  /**
   * Track error and attempt recovery if needed
   * @param error The error
   * @param context Error context
   */
  public trackErrorAndAttemptRecovery(error: unknown, context: string): boolean {
    this.trackError(context);
    const errorCount = this.getErrorCount(context);
    
    // Attempt recovery based on error frequency
    if (errorCount >= 3) {
      return this.attemptRecoveryForContext(context);
    }
    
    return false;
  }
  
  /**
   * Attempt recovery for specific error context
   * @param context Error context
   */
  private attemptRecoveryForContext(context: string): boolean {
    if (context.includes('document') || context.includes('backup')) {
      return this.attemptStorageRecovery(null);
    }
    
    return false;
  }
  
  /**
   * Attempt storage recovery by cleaning up storage
   * @param documentId Optional document ID to target
   */
  public attemptStorageRecovery(documentId: string | null): boolean {
    console.log('Attempting storage recovery...');
    
    try {
      // Verify and clean corrupted backups
      const cleanupStats = verifyAndCleanBackups();
      console.log('Storage recovery results:', cleanupStats);
      
      // If we successfully removed any corrupted backups, consider it successful
      return cleanupStats.removed > 0;
    } catch (error) {
      console.error('Error during storage recovery attempt:', error);
      return false;
    }
  }
}

export const recoveryStrategies = new RecoveryStrategies();
