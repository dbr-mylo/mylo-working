
/**
 * Document Recovery Strategies
 * 
 * This module provides specialized recovery strategies for document-related operations.
 */
import { ErrorCategory } from '@/utils/error/errorClassifier';
import { registerErrorAndAttemptRecovery } from '@/utils/error/selfHealingSystem';
import { removeBackup } from '@/utils/backup/documentBackupSystem';

/**
 * Handle consecutive errors tracking and determine recovery actions
 */
export class RecoveryStrategies {
  // Track consecutive errors to adjust recovery strategy
  private consecutiveErrors: { [key: string]: number } = {};
  private maxConsecutiveErrors = 3;
  
  /**
   * Reset error tracking state
   */
  public resetErrorTracking(): void {
    this.consecutiveErrors = {};
  }
  
  /**
   * Track consecutive errors and determine if self-healing should be attempted
   */
  public trackErrorAndAttemptRecovery(
    error: unknown,
    context: string
  ): boolean {
    // Track consecutive errors for this context
    this.consecutiveErrors[context] = (this.consecutiveErrors[context] || 0) + 1;
    
    // Check if we've hit max consecutive errors threshold
    if (this.consecutiveErrors[context] >= this.maxConsecutiveErrors) {
      // Try self-healing system for persistent errors
      const selfHealed = registerErrorAndAttemptRecovery(error, context);
      
      if (selfHealed) {
        // Reset counter if self-healing was successful
        this.consecutiveErrors[context] = 0;
      }
      
      return selfHealed;
    }
    
    return false;
  }
  
  /**
   * Reset error count for a specific context after successful operation
   */
  public resetErrorCount(context: string): void {
    this.consecutiveErrors[context] = 0;
  }
  
  /**
   * Attempt to recover storage space by cleaning up older backups
   */
  public attemptStorageRecovery(documentId: string | null): boolean {
    try {
      // If we have a document ID, we can try to remove its backups
      if (documentId) {
        return removeBackup(documentId);
      }
      
      return false;
    } catch (error) {
      console.error('Error during storage recovery attempt:', error);
      return false;
    }
  }
}
