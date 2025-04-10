
import { Document } from "@/lib/types";
import { FILE_SIZE_LIMITS } from "@/utils/fileExportUtils";
import { ClassifiedError, ErrorCategory, classifyError } from "./errorClassifier";

/**
 * Error types specific to file operations
 */
export enum FileErrorType {
  FILE_TOO_LARGE = 'file_too_large',
  INVALID_FORMAT = 'invalid_format',
  INCOMPATIBLE_TYPE = 'incompatible_type',
  CORRUPTED_FILE = 'corrupted_file',
  INVALID_CONTENT = 'invalid_content',
  MISSING_REQUIRED_FIELDS = 'missing_required_fields',
  PERMISSION_DENIED = 'permission_denied',
  UNKNOWN = 'unknown'
}

/**
 * Result of file validation
 */
export interface FileValidationResult {
  valid: boolean;
  error?: ClassifiedError;
  errorType?: FileErrorType;
  details?: string;
  size?: number;
}

/**
 * Validates a file before export
 */
export function validateFileForExport(
  document: Document,
  fileType: 'mylo' | 'pdf' | 'html'
): FileValidationResult {
  try {
    // Check for empty content
    if (!document.content || document.content.trim() === '') {
      return {
        valid: false,
        errorType: FileErrorType.INVALID_CONTENT,
        error: {
          category: ErrorCategory.VALIDATION,
          message: "Cannot export an empty document",
          technicalMessage: "Document content is empty or only whitespace",
          recoverable: true,
          suggestedAction: "Add content to your document before exporting"
        }
      };
    }
    
    // Check for title
    if (!document.title || document.title.trim() === '') {
      return {
        valid: false,
        errorType: FileErrorType.MISSING_REQUIRED_FIELDS,
        error: {
          category: ErrorCategory.VALIDATION,
          message: "Document requires a title before export",
          technicalMessage: "Document title is empty",
          recoverable: true,
          suggestedAction: "Add a title to your document before exporting"
        }
      };
    }
    
    // Calculate content size in MB
    const contentSize = (document.content.length * 2) / (1024 * 1024); // UTF-16 chars are 2 bytes each
    
    // Check size limits based on file type
    let sizeLimit = FILE_SIZE_LIMITS.MYLO_MAX_SIZE_MB;
    if (fileType === 'pdf') {
      sizeLimit = FILE_SIZE_LIMITS.PDF_MAX_SIZE_MB;
    }
    
    if (contentSize > sizeLimit) {
      return {
        valid: false,
        errorType: FileErrorType.FILE_TOO_LARGE,
        error: {
          category: ErrorCategory.STORAGE,
          message: `Document is too large to export as ${fileType.toUpperCase()}`,
          technicalMessage: `Document size (${contentSize.toFixed(1)}MB) exceeds the limit (${sizeLimit}MB)`,
          recoverable: false,
          suggestedAction: fileType === 'pdf' 
            ? "Try exporting as a .mylo file instead or reduce the document size" 
            : "Reduce document content or split into multiple documents"
        },
        size: contentSize
      };
    }
    
    return {
      valid: true,
      size: contentSize
    };
  } catch (error) {
    return {
      valid: false,
      errorType: FileErrorType.UNKNOWN,
      error: classifyError(error, `file.validate.${fileType}`),
      details: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Validates a file before import
 */
export function validateFileForImport(
  file: File,
  expectedType: 'mylo' | 'pdf' | 'html',
  currentRole: string
): FileValidationResult {
  try {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    
    // Get appropriate size limit
    let sizeLimit = FILE_SIZE_LIMITS.MYLO_MAX_SIZE_MB;
    if (expectedType === 'pdf') {
      sizeLimit = FILE_SIZE_LIMITS.PDF_MAX_SIZE_MB;
    }
    
    if (fileSizeMB > sizeLimit) {
      return {
        valid: false,
        errorType: FileErrorType.FILE_TOO_LARGE,
        error: {
          category: ErrorCategory.STORAGE,
          message: `File is too large to import (${fileSizeMB.toFixed(1)}MB)`,
          technicalMessage: `File size (${fileSizeMB.toFixed(1)}MB) exceeds the limit (${sizeLimit}MB)`,
          recoverable: false,
          suggestedAction: "Please use a smaller file"
        },
        size: fileSizeMB
      };
    }
    
    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (expectedType === 'mylo' && extension !== 'mylo' && extension !== 'json') {
      return {
        valid: false,
        errorType: FileErrorType.INVALID_FORMAT,
        error: {
          category: ErrorCategory.FORMAT,
          message: "Invalid file type",
          technicalMessage: `Expected .mylo file but got .${extension}`,
          recoverable: false,
          suggestedAction: "Please select a .mylo file"
        }
      };
    }
    
    return {
      valid: true,
      size: fileSizeMB
    };
  } catch (error) {
    return {
      valid: false,
      errorType: FileErrorType.UNKNOWN,
      error: classifyError(error, `file.validate.import.${expectedType}`),
      details: error instanceof Error ? error.message : String(error)
    };
  }
}
