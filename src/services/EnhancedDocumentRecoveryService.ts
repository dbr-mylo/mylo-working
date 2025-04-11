
import { DocumentRecoveryService } from './DocumentRecoveryService';
import { backupDocument, hasBackup, getDocumentBackup } from '@/utils/backup/documentBackupSystem';
import { ErrorCategory, classifyError } from '@/utils/error/errorClassifier';
import { Document, UserRole } from '@/lib/types';
import { RecoveryStrategies } from './recovery/RecoveryStrategies';
import { BackupFrequencyManager } from './recovery/BackupFrequencyManager';

/**
 * Enhanced recovery service that extends the base DocumentRecoveryService
 * with more advanced error handling and recovery strategies specifically
 * for document-related errors.
 */
export class EnhancedDocumentRecoveryService extends DocumentRecoveryService {
  private recoveryStrategies: RecoveryStrategies;
  private frequencyManager: BackupFrequencyManager;
  
  constructor() {
    super();
    this.recoveryStrategies = new RecoveryStrategies();
    this.frequencyManager = new BackupFrequencyManager();
  }
  
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
    this.recoveryStrategies.resetErrorTracking();
    
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
    // Calculate initial backup frequency based on context
    this.updateBackupFrequency();
    
    // Start auto-backup with intelligent timing
    this.startAutoBackup();
  }
  
  /**
   * Update backup frequency based on recent error rates
   */
  private updateBackupFrequency(): void {
    // Count total consecutive errors (implementation moved to RecoveryStrategies)
    const totalErrors = this.getTotalErrorCount();
    
    // Adjust frequency based on error count
    this.frequencyManager.adjustFrequency(totalErrors);
  }
  
  /**
   * Helper to count total errors across all contexts
   */
  private getTotalErrorCount(): number {
    // This is a simplified implementation since we've moved error tracking
    // to the RecoveryStrategies class
    return 0; // Default to 0 as we don't expose the internal error counts
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
    this.updateBackupFrequency();
    
    // Skip backup if last backup was too recent (unless force backup due to errors)
    const totalErrors = this.getTotalErrorCount();
    if (!this.frequencyManager.shouldCreateBackup(totalErrors)) {
      return false;
    }
    
    try {
      // Create backup using base method
      const result = super.createBackup(content, meta);
      
      if (result) {
        this.frequencyManager.setLastBackupTime(Date.now());
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
        this.recoveryStrategies.attemptStorageRecovery(this.documentId);
        
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
    // Track error and attempt recovery if needed
    this.recoveryStrategies.trackErrorAndAttemptRecovery(error, context);
    
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
    
    // Try normal recovery from base class
    const recoveryResult = super.handleErrorWithRecovery(error, context);
    
    // Reset consecutive errors if recovery succeeded
    if (recoveryResult.recovered) {
      this.recoveryStrategies.resetErrorCount(context);
    }
    
    return recoveryResult;
  }
  
  /**
   * Clean up and dispose of the service
   */
  public dispose(): void {
    // Reset error tracking
    this.recoveryStrategies.resetErrorTracking();
    
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
