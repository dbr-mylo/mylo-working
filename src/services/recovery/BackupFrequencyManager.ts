
/**
 * Manages intelligent backup frequency based on error rates and user activity
 */
export class BackupFrequencyManager {
  private lastBackupTime: number = 0;
  private baseFrequency: number = 60000; // 1 minute default
  private currentFrequency: number = 60000;
  private minFrequency: number = 15000; // 15 seconds minimum
  private maxFrequency: number = 300000; // 5 minutes maximum
  private consecutiveFailures: number = 0;
  private activityLevel: 'low' | 'medium' | 'high' = 'medium';
  
  /**
   * Adjust backup frequency based on error count
   * @param errorCount Number of errors
   */
  public adjustFrequency(errorCount: number): void {
    this.consecutiveFailures = errorCount;
    
    if (errorCount > 3) {
      // High error rate, increase backup frequency
      this.currentFrequency = Math.max(
        this.minFrequency, 
        this.baseFrequency / Math.min(4, errorCount)
      );
    } else if (errorCount > 0) {
      // Some errors, moderate increase in frequency
      this.currentFrequency = Math.max(
        this.minFrequency,
        this.baseFrequency / 2
      );
    } else {
      // No errors, adjust based on activity level
      this.adjustFrequencyByActivity();
    }
  }
  
  /**
   * Adjust frequency based on user activity level
   */
  private adjustFrequencyByActivity(): void {
    switch (this.activityLevel) {
      case 'high':
        this.currentFrequency = this.baseFrequency / 2;
        break;
      case 'medium':
        this.currentFrequency = this.baseFrequency;
        break;
      case 'low':
        this.currentFrequency = Math.min(this.maxFrequency, this.baseFrequency * 2);
        break;
    }
  }
  
  /**
   * Set user activity level
   * @param level Activity level
   */
  public setActivityLevel(level: 'low' | 'medium' | 'high'): void {
    if (this.activityLevel !== level) {
      this.activityLevel = level;
      this.adjustFrequencyByActivity();
    }
  }
  
  /**
   * Record when a backup was created
   * @param timestamp Backup creation time
   */
  public setLastBackupTime(timestamp: number): void {
    this.lastBackupTime = timestamp;
  }
  
  /**
   * Get current backup frequency
   */
  public getCurrentFrequency(): number {
    return this.currentFrequency;
  }
  
  /**
   * Check if enough time has passed to create a new backup
   * @param errorCount Optional error count to force backup
   */
  public shouldCreateBackup(errorCount: number = 0): boolean {
    // Always backup when errors are present
    if (errorCount > 0) return true;
    
    // Check if enough time has passed
    const timeSinceLastBackup = Date.now() - this.lastBackupTime;
    return timeSinceLastBackup >= this.currentFrequency;
  }
}
