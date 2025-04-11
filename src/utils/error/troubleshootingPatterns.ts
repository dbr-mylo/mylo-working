
/**
 * Troubleshooting Patterns
 * 
 * Provides pattern detection and resolution steps for known error scenarios.
 * Used by the interactive troubleshooting wizards to guide users through
 * resolution steps.
 */
import { ErrorCategory } from './errorClassifier';
import { getLocalStorage, setLocalStorage } from '@/utils/storage/localStorage';

// Define troubleshooting session storage key
const TROUBLESHOOTING_SESSIONS_KEY = 'troubleshooting_sessions';

// Pattern types
export enum ErrorPattern {
  NETWORK_CONNECTIVITY = 'network_connectivity',
  AUTHENTICATION_EXPIRED = 'authentication_expired',
  PERMISSION_DENIED = 'permission_denied',
  CONCURRENT_EDIT = 'concurrent_edit',
  STORAGE_FULL = 'storage_full',
  RATE_LIMITED = 'rate_limited',
  DOCUMENT_CORRUPTION = 'document_corruption',
  RESOURCE_MISSING = 'resource_missing',
  SERVER_OVERLOADED = 'server_overloaded',
  UNKNOWN = 'unknown'
}

// Resolution step structure
export interface ResolutionStep {
  id: string;
  description: string;
  instruction: string;
  automatable: boolean;
  completed: boolean;
  succeeded?: boolean;
  automatedAction?: () => Promise<boolean>;
}

// Session structure
export interface TroubleshootingSession {
  id: string;
  startedAt: number;
  lastUpdatedAt: number;
  errorCategory: ErrorCategory;
  errorMessage: string;
  context: string;
  pattern: ErrorPattern;
  currentStepIndex: number;
  steps: ResolutionStep[];
  resolved: boolean;
  notes?: string;
}

/**
 * Identify error pattern based on error details and context
 */
export function identifyErrorPattern(
  error: Error | unknown, 
  errorCategory: ErrorCategory,
  context: string
): ErrorPattern {
  const message = error instanceof Error ? error.message : String(error);
  
  // Network connectivity pattern
  if (
    errorCategory === ErrorCategory.NETWORK ||
    message.includes('offline') ||
    message.includes('network') ||
    message.includes('connection')
  ) {
    return ErrorPattern.NETWORK_CONNECTIVITY;
  }
  
  // Authentication pattern
  if (
    errorCategory === ErrorCategory.AUTHENTICATION ||
    errorCategory === ErrorCategory.AUTH ||
    message.includes('auth') ||
    message.includes('login') ||
    message.includes('token') ||
    message.includes('session')
  ) {
    return ErrorPattern.AUTHENTICATION_EXPIRED;
  }
  
  // Permission pattern
  if (
    errorCategory === ErrorCategory.PERMISSION ||
    message.includes('permission') ||
    message.includes('denied') ||
    message.includes('forbidden')
  ) {
    return ErrorPattern.PERMISSION_DENIED;
  }
  
  // Concurrent edit pattern
  if (
    context.includes('document') && 
    context.includes('edit') &&
    (message.includes('conflict') || message.includes('concurrent'))
  ) {
    return ErrorPattern.CONCURRENT_EDIT;
  }
  
  // Storage full pattern
  if (
    errorCategory === ErrorCategory.STORAGE ||
    message.includes('storage') ||
    message.includes('quota') ||
    message.includes('space')
  ) {
    return ErrorPattern.STORAGE_FULL;
  }
  
  // Rate limited pattern
  if (
    errorCategory === ErrorCategory.RATE_LIMIT ||
    message.includes('rate') ||
    message.includes('limit') ||
    message.includes('too many')
  ) {
    return ErrorPattern.RATE_LIMITED;
  }
  
  // Document corruption pattern
  if (
    context.includes('document') &&
    (message.includes('corrupt') || message.includes('invalid') || message.includes('malformed'))
  ) {
    return ErrorPattern.DOCUMENT_CORRUPTION;
  }
  
  // Resource missing pattern
  if (
    errorCategory === ErrorCategory.RESOURCE_NOT_FOUND ||
    message.includes('not found') ||
    message.includes('missing') ||
    message.includes('404')
  ) {
    return ErrorPattern.RESOURCE_MISSING;
  }
  
  // Server overloaded pattern
  if (
    errorCategory === ErrorCategory.SERVER &&
    (message.includes('overloaded') || message.includes('busy') || message.includes('later'))
  ) {
    return ErrorPattern.SERVER_OVERLOADED;
  }
  
  // If no specific pattern is identified
  return ErrorPattern.UNKNOWN;
}

/**
 * Get resolution steps for a specific error pattern
 */
export function getResolutionSteps(pattern: ErrorPattern): ResolutionStep[] {
  switch (pattern) {
    case ErrorPattern.NETWORK_CONNECTIVITY:
      return [
        {
          id: 'check_online',
          description: 'Check internet connection',
          instruction: 'Verify your device is connected to the internet',
          automatable: true,
          completed: false,
          automatedAction: async () => navigator.onLine
        },
        {
          id: 'refresh_page',
          description: 'Refresh the page',
          instruction: 'Try refreshing the browser page',
          automatable: false,
          completed: false
        },
        {
          id: 'try_different_network',
          description: 'Try a different network',
          instruction: 'If possible, switch to a different network (e.g., from WiFi to mobile data)',
          automatable: false,
          completed: false
        }
      ];
      
    case ErrorPattern.AUTHENTICATION_EXPIRED:
      return [
        {
          id: 'check_session',
          description: 'Check session status',
          instruction: 'Verifying your login session',
          automatable: true,
          completed: false
        },
        {
          id: 'refresh_token',
          description: 'Attempt to refresh authentication',
          instruction: 'Trying to refresh your authentication',
          automatable: true,
          completed: false
        },
        {
          id: 'relogin',
          description: 'Log in again',
          instruction: 'You may need to log in again to continue',
          automatable: false,
          completed: false
        }
      ];
    
    // Add more patterns with their resolution steps here
    
    default:
      return [
        {
          id: 'generic_refresh',
          description: 'Refresh the page',
          instruction: 'Try refreshing the browser page',
          automatable: false,
          completed: false
        },
        {
          id: 'clear_cache',
          description: 'Clear browser cache',
          instruction: 'Try clearing your browser cache and cookies',
          automatable: false,
          completed: false
        }
      ];
  }
}

/**
 * Save a troubleshooting session
 */
export function saveTroubleshootingSession(session: TroubleshootingSession): void {
  // Update last updated timestamp
  session.lastUpdatedAt = Date.now();
  
  try {
    // Get existing sessions
    const sessions = getLocalStorage<Record<string, TroubleshootingSession>>(TROUBLESHOOTING_SESSIONS_KEY) || {};
    
    // Add/update this session
    sessions[session.id] = session;
    
    // Save back to storage
    setLocalStorage(TROUBLESHOOTING_SESSIONS_KEY, sessions);
  } catch (e) {
    console.error('Failed to save troubleshooting session:', e);
  }
}

/**
 * Load a troubleshooting session
 */
export function loadTroubleshootingSession(sessionId: string): TroubleshootingSession | null {
  try {
    const sessions = getLocalStorage<Record<string, TroubleshootingSession>>(TROUBLESHOOTING_SESSIONS_KEY) || {};
    return sessions[sessionId] || null;
  } catch (e) {
    console.error('Failed to load troubleshooting session:', e);
    return null;
  }
}

/**
 * Add a step to a troubleshooting session
 */
export function addTroubleshootingStep(
  sessionId: string, 
  step: Omit<ResolutionStep, 'id'>
): TroubleshootingSession | null {
  try {
    const sessions = getLocalStorage<Record<string, TroubleshootingSession>>(TROUBLESHOOTING_SESSIONS_KEY) || {};
    const session = sessions[sessionId];
    
    if (!session) {
      return null;
    }
    
    // Add the step with a generated ID
    const newStep: ResolutionStep = {
      ...step,
      id: `step_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    };
    
    session.steps.push(newStep);
    session.lastUpdatedAt = Date.now();
    
    // Save the updated session
    sessions[sessionId] = session;
    setLocalStorage(TROUBLESHOOTING_SESSIONS_KEY, sessions);
    
    return session;
  } catch (e) {
    console.error('Failed to add troubleshooting step:', e);
    return null;
  }
}
