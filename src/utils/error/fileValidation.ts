
/**
 * File validation utilities for import/export operations
 */

// Error types for file validation
export enum FileErrorType {
  SIZE_EXCEEDED = 'SIZE_EXCEEDED',
  INVALID_TYPE = 'INVALID_TYPE',
  CORRUPTED = 'CORRUPTED',
  INCOMPATIBLE_VERSION = 'INCOMPATIBLE_VERSION',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  UNKNOWN = 'UNKNOWN'
}

// Maximum file sizes (in bytes)
const MAX_FILE_SIZES = {
  'application/json': 10 * 1024 * 1024, // 10MB
  'application/pdf': 50 * 1024 * 1024,  // 50MB
  'application/octet-stream': 20 * 1024 * 1024, // 20MB
  'text/plain': 5 * 1024 * 1024, // 5MB
  'image/png': 10 * 1024 * 1024, // 10MB
  'image/jpeg': 10 * 1024 * 1024, // 10MB
  'default': 5 * 1024 * 1024 // 5MB default
};

// Allowed file extensions for import
const ALLOWED_IMPORT_EXTENSIONS = ['.json', '.mylo'];

// Supported file types for export
const SUPPORTED_EXPORT_TYPES = [
  'application/json',
  'application/pdf',
  'text/plain',
  'application/octet-stream' // For .mylo files
];

export interface FileValidationResult {
  isValid: boolean;
  errorType?: FileErrorType;
  errorMessage?: string;
}

/**
 * Validate a file for import operations
 * @param file The file to validate
 * @returns Validation result
 */
export function validateFileForImport(file: File): FileValidationResult {
  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_IMPORT_EXTENSIONS.some(ext => 
    fileName.endsWith(ext.toLowerCase())
  );
  
  if (!hasValidExtension) {
    return {
      isValid: false,
      errorType: FileErrorType.INVALID_TYPE,
      errorMessage: `Invalid file type. Allowed types: ${ALLOWED_IMPORT_EXTENSIONS.join(', ')}`
    };
  }
  
  // Check file size
  const maxSize = MAX_FILE_SIZES[file.type] || MAX_FILE_SIZES.default;
  if (file.size > maxSize) {
    return {
      isValid: false,
      errorType: FileErrorType.SIZE_EXCEEDED,
      errorMessage: `File too large. Maximum allowed size: ${formatFileSize(maxSize)}`
    };
  }
  
  return { isValid: true };
}

/**
 * Validate a file for export operations
 * @param fileType File type to validate
 * @param fileSize Size of the file to export
 * @returns Validation result
 */
export function validateFileForExport(
  fileType: string,
  fileSize: number
): FileValidationResult {
  // Check supported file type
  if (!SUPPORTED_EXPORT_TYPES.includes(fileType)) {
    return {
      isValid: false,
      errorType: FileErrorType.INVALID_TYPE,
      errorMessage: `Unsupported export format: ${fileType}`
    };
  }
  
  // Check file size
  const maxSize = MAX_FILE_SIZES[fileType] || MAX_FILE_SIZES.default;
  if (fileSize > maxSize) {
    return {
      isValid: false,
      errorType: FileErrorType.SIZE_EXCEEDED,
      errorMessage: `Export content too large. Maximum allowed size: ${formatFileSize(maxSize)}`
    };
  }
  
  return { isValid: true };
}

/**
 * Format file size in human-readable format
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return bytes + ' bytes';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}
