
/**
 * Document integrity utilities for detecting corruption and ensuring data consistency
 */
import { DocumentBackup } from './documentBackupSystem';
import SHA256 from 'crypto-js/sha256';
import encHex from 'crypto-js/enc-hex';

/**
 * Generate a checksum for document content
 * @param content Document content to generate checksum for
 * @returns SHA-256 checksum as hex string
 */
export function generateDocumentChecksum(content: string): string {
  if (!content) return '';
  return SHA256(content).toString(encHex);
}

/**
 * Validate document content against a stored checksum
 * @param content Document content to validate
 * @param storedChecksum Checksum to validate against
 * @returns Boolean indicating if content matches checksum
 */
export function validateDocumentChecksum(content: string, storedChecksum: string): boolean {
  if (!content || !storedChecksum) return false;
  const calculatedChecksum = generateDocumentChecksum(content);
  return calculatedChecksum === storedChecksum;
}

/**
 * Add checksum to document backup
 * @param backup Document backup to add checksum to
 * @returns Document backup with checksum added
 */
export function addChecksumToBackup(backup: DocumentBackup): DocumentBackup {
  if (!backup.content) return backup;
  
  // Generate checksum for document content
  const checksum = generateDocumentChecksum(backup.content);
  
  // Add checksum to meta data
  return {
    ...backup,
    meta: {
      ...(backup.meta || {}),
      integrity: {
        checksum,
        algorithm: 'sha256',
        timestamp: new Date().toISOString()
      }
    }
  };
}

/**
 * Verify document backup integrity using stored checksum
 * @param backup Document backup to verify
 * @returns Object with validation result and status
 */
export function verifyBackupIntegrity(backup: DocumentBackup): { 
  valid: boolean; 
  status: 'valid' | 'corrupted' | 'no-checksum';
  details?: string;
} {
  // If no backup or no content, it's not valid
  if (!backup || !backup.content) {
    return { valid: false, status: 'corrupted', details: 'Missing backup content' };
  }
  
  // If no checksum in metadata, we can't validate
  if (!backup.meta?.integrity?.checksum) {
    return { valid: false, status: 'no-checksum', details: 'No checksum available' };
  }
  
  // Validate content against stored checksum
  const isValid = validateDocumentChecksum(
    backup.content, 
    backup.meta.integrity.checksum
  );
  
  return {
    valid: isValid,
    status: isValid ? 'valid' : 'corrupted',
    details: isValid ? 'Content integrity verified' : 'Content does not match checksum'
  };
}

/**
 * Attempt to recover corrupted document content
 * This is a basic implementation that could be expanded with more sophisticated
 * recovery techniques in the future
 * 
 * @param corruptedContent Potentially corrupted document content
 * @returns Object with recovery result and recovered content if possible
 */
export function attemptContentRecovery(corruptedContent: string): {
  recovered: boolean;
  content: string | null;
  recoveryMethod: string;
} {
  // If content is empty, nothing to recover
  if (!corruptedContent) {
    return { recovered: false, content: null, recoveryMethod: 'none' };
  }
  
  try {
    // Basic recovery - try to fix common JSON corruption issues
    // For XML/HTML documents with potential unclosed tags
    if (corruptedContent.includes('<') && corruptedContent.includes('>')) {
      // Remove any incomplete or malformed tags at the end
      const cleanedContent = corruptedContent.replace(/<[^>]*$/, '');
      
      // If we managed to clean something
      if (cleanedContent !== corruptedContent) {
        return {
          recovered: true,
          content: cleanedContent,
          recoveryMethod: 'tag-repair'
        };
      }
    }
    
    // For potential JSON content
    if ((corruptedContent.includes('{') && corruptedContent.includes('}')) || 
        (corruptedContent.includes('[') && corruptedContent.includes(']'))) {
      try {
        // Find the last complete JSON object/array
        const lastObjectEnd = corruptedContent.lastIndexOf('}');
        const lastArrayEnd = corruptedContent.lastIndexOf(']');
        
        if (lastObjectEnd > 0 || lastArrayEnd > 0) {
          const endPos = Math.max(lastObjectEnd, lastArrayEnd) + 1;
          const truncatedContent = corruptedContent.substring(0, endPos);
          
          // Validate by parsing
          JSON.parse(truncatedContent);
          
          return {
            recovered: true,
            content: truncatedContent,
            recoveryMethod: 'json-truncate'
          };
        }
      } catch (e) {
        // JSON recovery failed, continue with other methods
      }
    }
    
    // Enhanced recovery: Try to find the longest valid segment
    // Split by common delimiters and try to recover partial content
    const lines = corruptedContent.split(/\n|\r\n/);
    if (lines.length > 1) {
      // Try to find the last line that doesn't appear corrupt
      for (let i = lines.length - 1; i > 0; i--) {
        const partialContent = lines.slice(0, i).join('\n');
        if (partialContent.length > corruptedContent.length * 0.7) { // At least 70% recovered
          return {
            recovered: true,
            content: partialContent,
            recoveryMethod: 'line-truncation'
          };
        }
      }
    }
    
    // If we can't do any special recovery, just return the content as-is
    // with a flag indicating we couldn't recover it
    return {
      recovered: false,
      content: corruptedContent,
      recoveryMethod: 'none'
    };
  } catch (e) {
    console.error('Error during content recovery attempt:', e);
    return {
      recovered: false,
      content: null,
      recoveryMethod: 'none'
    };
  }
}

/**
 * Enhanced backup integrity verification with repair attempt
 * @param backup Document backup to verify and repair if needed
 * @returns Object with verification result, status and repaired backup if applicable
 */
export function verifyAndRepairBackup(backup: DocumentBackup): {
  valid: boolean;
  status: 'valid' | 'repaired' | 'corrupted' | 'no-checksum';
  repairedBackup?: DocumentBackup;
} {
  // First verify the backup
  const verificationResult = verifyBackupIntegrity(backup);
  
  // If valid or no checksum, return as is
  if (verificationResult.valid || verificationResult.status === 'no-checksum') {
    return {
      valid: verificationResult.valid,
      status: verificationResult.status
    };
  }
  
  // Attempt to recover corrupted content
  const recoveryResult = attemptContentRecovery(backup.content);
  
  if (recoveryResult.recovered && recoveryResult.content) {
    // Create repaired backup
    const repairedBackup: DocumentBackup = {
      ...backup,
      content: recoveryResult.content,
      meta: {
        ...(backup.meta || {}),
        recovery: {
          timestamp: new Date().toISOString(),
          method: recoveryResult.recoveryMethod,
          originalChecksum: backup.meta?.integrity?.checksum
        }
      }
    };
    
    // Generate new checksum for repaired content
    const repairedWithChecksum = addChecksumToBackup(repairedBackup);
    
    return {
      valid: true,
      status: 'repaired',
      repairedBackup: repairedWithChecksum
    };
  }
  
  // Could not repair
  return {
    valid: false,
    status: 'corrupted'
  };
}
