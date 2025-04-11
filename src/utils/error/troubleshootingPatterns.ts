
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
  feature?: string;
  name?: string;
}

/**
 * Identify error pattern based on error details and context
 * @returns Array of matching error patterns
 */
export function identifyErrorPattern(
  error: Error | unknown,
  context: string
): string[] {
  const message = error instanceof Error ? error.message : String(error);
  const patterns: string[] = [];
  
  // Network connectivity pattern
  if (
    message.includes('offline') ||
    message.includes('network') ||
    message.includes('connection')
  ) {
    patterns.push("Check internet connection and try again.");
  }
  
  // Authentication pattern
  if (
    message.includes('auth') ||
    message.includes('login') ||
    message.includes('token') ||
    message.includes('session')
  ) {
    patterns.push("Refresh your authentication session.");
  }
  
  // Permission pattern
  if (
    message.includes('permission') ||
    message.includes('denied') ||
    message.includes('forbidden')
  ) {
    patterns.push("Verify you have the necessary permissions for this action.");
  }
  
  // Concurrent edit pattern
  if (
    context.includes('document') && 
    context.includes('edit') &&
    (message.includes('conflict') || message.includes('concurrent'))
  ) {
    patterns.push("Resolve editing conflicts by reloading the latest document version.");
  }
  
  // Storage full pattern
  if (
    message.includes('storage') ||
    message.includes('quota') ||
    message.includes('space')
  ) {
    patterns.push("Clear browser storage to free up space.");
  }
  
  // If no specific pattern is identified
  if (patterns.length === 0) {
    patterns.push("Try refreshing the page or restarting the application.");
  }
  
  return patterns;
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
export function saveTroubleshootingSession(
  sessionId: string,
  sessionData: { name: string; notes: string; status: string }
): void {
  try {
    // Get existing sessions
    const sessions = getLocalStorage<Record<string, TroubleshootingSession>>(TROUBLESHOOTING_SESSIONS_KEY) || {};
    
    // Get existing or initialize new session
    const existingSession = sessions[sessionId] || {
      id: sessionId,
      startedAt: Date.now(),
      lastUpdatedAt: Date.now(),
      errorCategory: ErrorCategory.UNKNOWN,
      errorMessage: "Unknown error",
      context: "unknown",
      pattern: ErrorPattern.UNKNOWN,
      currentStepIndex: 0,
      steps: [],
      resolved: false
    };
    
    // Update session properties
    existingSession.name = sessionData.name;
    existingSession.notes = sessionData.notes;
    existingSession.lastUpdatedAt = Date.now();
    existingSession.resolved = sessionData.status === 'resolved';
    
    // Save back to storage
    sessions[sessionId] = existingSession;
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
  description: string,
  status: "success" | "failure" | "inconclusive",
  details?: string
): TroubleshootingSession | null {
  try {
    const sessions = getLocalStorage<Record<string, TroubleshootingSession>>(TROUBLESHOOTING_SESSIONS_KEY) || {};
    const session = sessions[sessionId];
    
    if (!session) {
      return null;
    }
    
    // Add the step with a generated ID
    const newStep: ResolutionStep = {
      id: `step_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      description,
      instruction: details || description,
      automatable: false,
      completed: true,
      succeeded: status === "success"
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
