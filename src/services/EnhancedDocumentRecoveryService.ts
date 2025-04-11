
import { DocumentRecoveryService } from './DocumentRecoveryService';
import { backupDocument, hasBackup, getDocumentBackup, removeBackup } from '@/utils/backup/documentBackupSystem';
import { ErrorCategory, classifyError } from '@/utils/error/errorClassifier';
import { Document, UserRole } from '@/lib/types';
import { registerErrorAndAttemptRecovery } from '@/utils/error/selfHealingSystem';

/**
 * Enhanced recovery service that extends the base DocumentRecoveryService
 * with more advanced error handling and recovery strategies specifically
 * for document-related errors.
 */
export class EnhancedDocumentRecoveryService extends DocumentRecoveryService {
  // Track consecutive errors to adjust recovery strategy
  private consecutiveErrors: { [key: string]: number } = {};
  private maxConsecutiveErrors = 3;
  private backupFrequency = 60000; // ms
  private lastBackupTime = 0;
  
  /**
   * Initialize the enhanced recovery service
   */
  public initialize(
    documentId: string | null,
    documentTitle: string,
    userRole: UserRole | null,
    onBackupCreated?: (timestamp: Date) => void
  ): void {
    // Reset error tracking
    this.consecutiveErrors = {};
    
    // Initialize base service
    super.initialize(documentId, documentTitle, userRole, onBackupCreated);
    
    // Start intelligent backup schedule
    this.startIntelligentBackupSchedule();
  }
  
  /**
   * Start an intelligent backup schedule that adjusts frequency
   * based on edit frequency and error rates
   */
  private startIntelligentBackupSchedule(): void {
    // Initial backup interval
    this.adjustBackupFrequency();
    
    // Start auto-backup with intelligent timing
    this.startAutoBackup();
  }
  
  /**
   * Adjust backup frequency based on recent error rates and edit frequency
   */
  private adjustBackupFrequency(): void {
    // Count total consecutive errors
    const totalErrors = Object.values(this.consecutiveErrors)
      .reduce((sum, count) => sum + count, 0);
    
    // Adjust frequency based on error count
    if (totalErrors > this.maxConsecutiveErrors) {
      // More frequent backups when errors are high
      this.backupFrequency = 15000; // 15 seconds
    } else if (totalErrors > 0) {
      // Moderate frequency with some errors
      this.backupFrequency = 30000; // 30 seconds
    } else {
      // Normal frequency when no errors
      this.backupFrequency = 60000; // 1 minute
    }
    
    console.log(`Adjusted backup frequency to ${this.backupFrequency}ms based on error rate`);
  }
  
  /**
   * Create backup with intelligent timing and error handling
   */
  public createBackup(content: string, meta?: any): boolean {
    // Don't backup if content is empty or only whitespace
    if (!content || !content.trim()) {
      return false;
    }
    
    // Check if we need to adjust backup frequency
    this.adjustBackupFrequency();
    
    // Skip backup if last backup was too recent (unless force backup due to errors)
    if (
      this.lastBackupTime > 0 &&
      Date.now() - this.lastBackupTime < this.backupFrequency &&
      Object.values(this.consecutiveErrors).reduce((sum, count) => sum + count, 0) === 0
    ) {
      return false;
    }
    
    try {
      // Create backup using base method
      const result = super.createBackup(content, meta);
      
      if (result) {
        this.lastBackupTime = Date.now();
      }
      
      return result;
    } catch (error) {
      // Handle storage errors specifically
      console.error('Error creating backup:', error);
      
      // Try to recover storage space if we hit quota issues
      if (
        error instanceof Error && 
        (error.name === 'QuotaExceededError' || error.message.includes('quota'))
      ) {
        this.attemptStorageRecovery();
        
        // Try again after recovery attempt
        try {
          return super.createBackup(content, meta);
        } catch (retryError) {
          console.error('Failed to create backup after storage recovery:', retryError);
          return false;
        }
      }
      
      return false;
    }
  }
  
  /**
   * Enhanced error handling with specific document recovery strategies
   */
  public handleErrorWithRecovery(error: unknown, context: string): {
    recovered: boolean;
    recoveryDocument?: Document | null;
  } {
    // Track consecutive errors for this context
    this.consecutiveErrors[context] = (this.consecutiveErrors[context] || 0) + 1;
    
    // Get classified error
    const classifiedError = classifyError(error, context);
    
    // Force immediate backup on certain errors if we have content to back up
    if (
      this.lastBackupContent && 
      (classifiedError.category === ErrorCategory.NETWORK ||
       classifiedError.category === ErrorCategory.SERVER ||
       classifiedError.category === ErrorCategory.STORAGE)
    ) {
      try {
        this.createBackup(this.lastBackupContent, { forcedBackup: true, errorContext: context });
      } catch (backupError) {
        console.warn('Failed to create forced backup during error handling:', backupError);
      }
    }
    
    // Check if we've hit max consecutive errors threshold
    if (this.consecutiveErrors[context] >= this.maxConsecutiveErrors) {
      // Try self-healing system for persistent errors
      const selfHealed = registerErrorAndAttemptRecovery(error, context);
      
      if (selfHealed) {
        // Reset counter if self-healing was successful
        this.consecutiveErrors[context] = 0;
      }
    }
    
    // Try normal recovery
    const recoveryResult = super.handleErrorWithRecovery(error, context);
    
    // Reset consecutive errors if recovery succeeded
    if (recoveryResult.recovered) {
      this.consecutiveErrors[context] = 0;
    }
    
    return recoveryResult;
  }
  
  /**
   * Attempt to recover storage space by cleaning up older backups
   */
  private attemptStorageRecovery(): boolean {
    try {
      // This would integrate with the documentBackupSystem to clear space
      // by removing older backups or compressing existing ones
      
      // For now, we'll just remove this document's backups if we're dealing with storage issues
      if (this.documentId) {
        return removeBackup(this.documentId);
      }
      
      return false;
    } catch (error) {
      console.error('Error during storage recovery attempt:', error);
      return false;
    }
  }
  
  /**
   * Clean up and dispose of the service
   */
  public dispose(): void {
    // Reset error tracking
    this.consecutiveErrors = {};
    
    // Clean up base service
    super.dispose();
  }
  
  /**
   * Create singleton instance for app-wide use
   */
  public static createInstance(): EnhancedDocumentRecoveryService {
    return new EnhancedDocumentRecoveryService();
  }
}

// Singleton service instance
export const enhancedDocumentRecoveryService = EnhancedDocumentRecoveryService.createInstance();
