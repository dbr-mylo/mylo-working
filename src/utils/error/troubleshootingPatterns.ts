
import { ErrorPattern, TroubleshootingSession, TroubleshootingStep } from '../featureFlags/types';
import { ErrorCategory, classifyError } from './errorClassifier';

// Sample error patterns for common issues
const ERROR_PATTERNS: ErrorPattern[] = [
  {
    pattern: "Network Error",
    category: "network",
    frequency: 120,
    remediation: "Check your internet connection and retry the operation.",
    autoRecoverable: true,
    successRate: 0.85
  },
  {
    pattern: "Failed to fetch",
    category: "network",
    frequency: 95,
    remediation: "Connection to the server was interrupted. Refresh the application to reconnect.",
    autoRecoverable: true,
    successRate: 0.75
  },
  {
    pattern: "Unauthorized",
    category: "auth",
    frequency: 78,
    remediation: "Your session has expired. Please log in again.",
    autoRecoverable: true,
    successRate: 0.95
  },
  {
    pattern: "Permission denied",
    category: "auth",
    frequency: 45,
    remediation: "You don't have permission to access this resource. Contact your administrator.",
    autoRecoverable: false,
    successRate: 0.2
  },
  {
    pattern: "QuotaExceededError",
    category: "storage",
    frequency: 32,
    remediation: "Storage quota exceeded. Clear some space in your browser storage.",
    autoRecoverable: true,
    successRate: 0.6
  },
  {
    pattern: "TypeError: Cannot read property",
    category: "data",
    frequency: 120,
    remediation: "Data integrity issue. Clear application cache and reload.",
    autoRecoverable: true,
    successRate: 0.7
  },
  {
    pattern: "Loading chunk",
    category: "resource",
    frequency: 85,
    remediation: "Failed to load resource. Clear cache and reload the application.",
    autoRecoverable: true,
    successRate: 0.9
  }
];

const SESSIONS_STORAGE_KEY = 'error_troubleshooting_sessions';

/**
 * Identify matching error patterns for an error
 * @param error The error to analyze
 * @param context The context where the error occurred
 * @returns Array of remediation suggestions
 */
export function identifyErrorPattern(error: Error, context: string): string[] {
  const errorMessage = error.message;
  const errorStack = error.stack || '';
  const errorCategory = classifyError(error, context).category;
  
  // Find matching patterns
  const matches = ERROR_PATTERNS.filter(pattern => {
    // Check if pattern string appears in error message or stack
    const matchesPattern = 
      errorMessage.includes(pattern.pattern) || 
      errorStack.includes(pattern.pattern);
    
    // Check if category matches
    const matchesCategory = 
      pattern.category === errorCategory || 
      pattern.category === ErrorCategory[errorCategory as keyof typeof ErrorCategory]?.toLowerCase();
    
    return matchesPattern || matchesCategory;
  });
  
  // Return remediation suggestions
  return matches.map(pattern => pattern.remediation);
}

/**
 * Save a troubleshooting session
 * @param sessionId The ID of the session to save
 * @param data The session data to save
 */
export function saveTroubleshootingSession(
  sessionId: string, 
  data: { name: string; notes: string; status: string }
): void {
  try {
    // Get existing sessions
    const sessionsJson = localStorage.getItem(SESSIONS_STORAGE_KEY);
    const sessions: Record<string, any> = sessionsJson ? JSON.parse(sessionsJson) : {};
    
    // Update or create the session
    sessions[sessionId] = {
      ...sessions[sessionId],
      ...data,
      updatedAt: Date.now()
    };
    
    // Save back to localStorage
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save troubleshooting session:', error);
  }
}

/**
 * Load a troubleshooting session
 * @param sessionId The ID of the session to load
 * @returns The session data or null if not found
 */
export function loadTroubleshootingSession(sessionId: string): { name: string; notes: string } | null {
  try {
    // Get existing sessions
    const sessionsJson = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!sessionsJson) return null;
    
    const sessions = JSON.parse(sessionsJson);
    return sessions[sessionId] || null;
  } catch (error) {
    console.error('Failed to load troubleshooting session:', error);
    return null;
  }
}

/**
 * Add a step to a troubleshooting session
 * @param sessionId The ID of the session
 * @param action The action taken
 * @param result The result of the action
 * @param notes Optional notes about the step
 */
export function addTroubleshootingStep(
  sessionId: string,
  action: string,
  result: 'success' | 'failure' | 'inconclusive',
  notes?: string
): void {
  try {
    // Get existing sessions
    const sessionsJson = localStorage.getItem(SESSIONS_STORAGE_KEY);
    const sessions: Record<string, any> = sessionsJson ? JSON.parse(sessionsJson) : {};
    
    // Create or get the session
    if (!sessions[sessionId]) {
      sessions[sessionId] = {
        id: sessionId,
        steps: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'in-progress'
      };
    }
    
    // Add the step
    const step: TroubleshootingStep = {
      id: Math.random().toString(36).substring(2, 9),
      action,
      result,
      timestamp: Date.now(),
      notes
    };
    
    if (!sessions[sessionId].steps) {
      sessions[sessionId].steps = [];
    }
    
    sessions[sessionId].steps.push(step);
    sessions[sessionId].updatedAt = Date.now();
    
    // Save back to localStorage
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to add troubleshooting step:', error);
  }
}

/**
 * Get all troubleshooting sessions
 * @returns Array of sessions
 */
export function getAllTroubleshootingSessions(): TroubleshootingSession[] {
  try {
    const sessionsJson = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!sessionsJson) return [];
    
    const sessions = JSON.parse(sessionsJson);
    return Object.values(sessions);
  } catch (error) {
    console.error('Failed to get troubleshooting sessions:', error);
    return [];
  }
}

/**
 * Clear a troubleshooting session
 * @param sessionId The ID of the session to clear
 */
export function clearTroubleshootingSession(sessionId: string): void {
  try {
    const sessionsJson = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!sessionsJson) return;
    
    const sessions = JSON.parse(sessionsJson);
    delete sessions[sessionId];
    
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to clear troubleshooting session:', error);
  }
}

/**
 * Mark a troubleshooting session as resolved
 * @param sessionId The ID of the session to mark as resolved
 */
export function markSessionResolved(sessionId: string): void {
  try {
    const sessionsJson = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!sessionsJson) return;
    
    const sessions = JSON.parse(sessionsJson);
    if (sessions[sessionId]) {
      sessions[sessionId].status = 'resolved';
      sessions[sessionId].resolvedAt = Date.now();
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    }
  } catch (error) {
    console.error('Failed to mark troubleshooting session as resolved:', error);
  }
}
