
# Developer Documentation: Error Handling & Recovery Systems

## Error Classification System

The error handling system uses a classification approach to provide consistent error management across the application.

### Key Components

- `errorClassifier.ts`: Categorizes errors based on message content and context
- `handleError.ts`: Centralizes error handling with logging, analytics, and user notifications
- `roleSpecificErrors.ts`: Customizes error messaging based on user roles

### Error Categories

Errors are classified into the following categories:

```typescript
export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  VALIDATION = 'validation',
  STORAGE = 'storage',
  FORMAT = 'format',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown'
}
```

### Usage Example

```typescript
// Automatically classify and handle an error
try {
  await saveDocument(content);
} catch (error) {
  handleError(error, "documentEditor.save");
}

// Role-aware error handling
try {
  await exportDocument(content, "pdf");
} catch (error) {
  handleRoleAwareError(error, "documentExport", userRole);
}
```

## Document Backup System

The backup system provides automatic recovery from data loss using browser localStorage.

### Key Components

- `documentBackupSystem.ts`: Core backup functionality
- `useDocumentBackupRecovery.ts`: Hook for React components to utilize backup/recovery

### How It Works

1. Periodic backups are created during document editing
2. Backups are stored in localStorage with document ID or role as identifier
3. On component mount, the system checks for available backups
4. If a backup is found, the user is prompted to recover

### Storage Format

```typescript
interface BackupDocument {
  id: string | null;
  content: string;
  title: string;
  role: string;
  timestamp: string;
  meta?: DocumentMeta;
}
```

### Usage Example

```typescript
const { 
  hasAvailableBackup,
  checkForBackups,
  recoverFromBackup,
  clearBackupAfterSave
} = useDocumentBackupRecovery({
  documentId,
  role
});

// Check for backups on load
useEffect(() => {
  if (checkForBackups() && hasAvailableBackup) {
    // Show recovery dialog
  }
}, []);

// Clear backup after successful save
useEffect(() => {
  if (saveSuccess) {
    clearBackupAfterSave();
  }
}, [saveSuccess]);
```

## Progress Indicators

The application uses accessible progress indicators for lengthy operations.

### Components

- `ProgressBar.tsx`: Main progress component with accessibility support
- `ExportProgressDialog.tsx`: Dialog for file export progress

### ProgressBar Props

```typescript
interface ProgressBarProps {
  value: number;                  // 0-100 progress value
  label?: string;                 // Optional label
  statusMessage?: string;         // Optional status message
  className?: string;             // Optional CSS class
  showPercentage?: boolean;       // Whether to show percentage
  isIndeterminate?: boolean;      // For unknown progress
  ariaLabel?: string;             // Accessibility label
  id?: string;                    // Element ID
}
```

### Usage Example

```typescript
<ProgressBar
  value={uploadProgress}
  label="Uploading Document"
  statusMessage={`${bytesUploaded} of ${totalBytes} uploaded`}
  isIndeterminate={false}
  showPercentage={true}
/>
```

## File Validation System

The file validation system ensures that files meet requirements before export/import.

### Key Components

- `fileValidation.ts`: Contains validation logic
- `fileExportUtils.ts`: Utilities for exporting files with validation

### Validation Results

```typescript
interface FileValidationResult {
  valid: boolean;
  error?: ClassifiedError;
  errorType?: FileErrorType;
  details?: string;
  size?: number;
}
```

### Error Types

```typescript
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
```

### Usage Example

```typescript
// Validate document before export
const validationResult = validateFileForExport(document, "pdf");
if (!validationResult.valid) {
  // Show error
  return;
}

// Proceed with export
await exportToPDF(document);
```

## Testing Strategy

Tests are organized by feature area:

- Error system tests: `src/tests/error/*`
- Backup system tests: `src/tests/backup/*`
- File operation tests: `src/tests/file/*`

### Error Tests

- Test error classification with various error types
- Verify role-specific error messages
- Test error boundary recovery

### Backup Tests

- Verify backup creation and retrieval
- Test recovery process
- Check backup cleanup

### File Validation Tests

- Test file size validation
- Verify format validation
- Test import/export validation
