
/**
 * Backup Frequency Manager
 * 
 * This module handles the intelligent adjustment of backup frequency
 * based on error rates and other factors.
 */

export class BackupFrequencyManager {
  private backupFrequency = 60000; // Default: 1 minute
  private lastBackupTime = 0;
  
  /**
   * Get the current backup frequency in milliseconds
   */
  public getBackupFrequency(): number {
    return this.backupFrequency;
  }
  
  /**
   * Get the timestamp of the last backup
   */
  public getLastBackupTime(): number {
    return this.lastBackupTime;
  }
  
  /**
   * Set the timestamp of the last backup
   */
  public setLastBackupTime(time: number): void {
    this.lastBackupTime = time;
  }
  
  /**
   * Determine if enough time has passed since the last backup
   */
  public shouldCreateBackup(totalErrors: number): boolean {
    // Skip time-based checks if we have errors (force backup)
    if (totalErrors > 0) {
      return true;
    }
    
    // If no previous backup or enough time has passed
    return (
      this.lastBackupTime === 0 || 
      Date.now() - this.lastBackupTime >= this.backupFrequency
    );
  }
  
  /**
   * Adjust backup frequency based on error count
   */
  public adjustFrequency(totalErrors: number): void {
    if (totalErrors > 3) {
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
}
