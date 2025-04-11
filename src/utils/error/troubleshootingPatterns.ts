
/**
 * Troubleshooting patterns utility for error recovery and session management
 */

// Define session types
interface TroubleshootingSession {
  id: string;
  name: string;
  notes?: string;
  feature?: string;
  status: 'in-progress' | 'resolved' | 'abandoned';
  steps: TroubleshootingStep[];
  createdAt: string;
  updatedAt: string;
}

interface TroubleshootingStep {
  timestamp: string;
  action: string;
  result: 'success' | 'failure' | 'inconclusive';
  notes?: string;
}

// Define pattern for known error recovery strategies
const knownErrorPatterns: Record<string, string[]> = {
  'network': [
    'Reset your network connection',
    'Clear browser cache and cookies',
    'Try a different network'
  ],
  'auth': [
    'Clear saved credentials',
    'Log out and log back in',
    'Reset your session cookies'
  ],
  'storage': [
    'Clear browser local storage',
    'Check for storage quota issues',
    'Allow more storage permissions'
  ]
};

/**
 * Identify patterns in an error that match known troubleshooting strategies
 * @param error The error object
 * @param context The context where the error occurred
 * @returns Array of suggested remediation steps
 */
export function identifyErrorPattern(error: unknown, context: string): string[] {
  const patterns: string[] = [];
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Look for network-related patterns
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('offline') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('fetch') ||
    context.includes('api') ||
    context.includes('http')
  ) {
    patterns.push(...knownErrorPatterns.network);
  }
  
  // Look for auth-related patterns
  if (
    errorMessage.includes('auth') ||
    errorMessage.includes('login') ||
    errorMessage.includes('token') ||
    errorMessage.includes('permission') ||
    errorMessage.includes('401') ||
    errorMessage.includes('403') ||
    context.includes('auth') ||
    context.includes('login')
  ) {
    patterns.push(...knownErrorPatterns.auth);
  }
  
  // Look for storage-related patterns
  if (
    errorMessage.includes('storage') ||
    errorMessage.includes('quota') ||
    errorMessage.includes('localStorage') ||
    errorMessage.includes('database') ||
    context.includes('storage') ||
    context.includes('save')
  ) {
    patterns.push(...knownErrorPatterns.storage);
  }
  
  return patterns;
}

/**
 * Save a troubleshooting session
 * @param sessionId Unique identifier for the session
 * @param sessionData Data to save with the session
 */
export function saveTroubleshootingSession(
  sessionId: string,
  sessionData: Partial<TroubleshootingSession>
): boolean {
  try {
    // Get existing session or create new one
    const existingData = loadTroubleshootingSession(sessionId);
    
    const session: TroubleshootingSession = {
      id: sessionId,
      name: sessionData.name || existingData?.name || 'Unnamed session',
      notes: sessionData.notes || existingData?.notes || '',
      feature: sessionData.feature || existingData?.feature,
      status: sessionData.status || existingData?.status || 'in-progress',
      steps: existingData?.steps || [],
      createdAt: existingData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem(`troubleshooting_${sessionId}`, JSON.stringify(session));
    return true;
  } catch (e) {
    console.error('Failed to save troubleshooting session:', e);
    return false;
  }
}

/**
 * Load a troubleshooting session
 * @param sessionId Unique identifier for the session
 */
export function loadTroubleshootingSession(
  sessionId: string
): TroubleshootingSession | null {
  try {
    const data = localStorage.getItem(`troubleshooting_${sessionId}`);
    if (!data) return null;
    
    return JSON.parse(data) as TroubleshootingSession;
  } catch (e) {
    console.error('Failed to load troubleshooting session:', e);
    return null;
  }
}

/**
 * Add a step to a troubleshooting session
 * @param sessionId Unique identifier for the session
 * @param action Description of the action taken
 * @param result Result of the action (success, failure, inconclusive)
 * @param notes Optional notes about the step
 */
export function addTroubleshootingStep(
  sessionId: string,
  action: string,
  result: 'success' | 'failure' | 'inconclusive',
  notes?: string
): boolean {
  try {
    const session = loadTroubleshootingSession(sessionId);
    if (!session) return false;
    
    // Add the new step
    session.steps.push({
      timestamp: new Date().toISOString(),
      action,
      result,
      notes
    });
    
    // Update session
    session.updatedAt = new Date().toISOString();
    
    // Save the updated session
    localStorage.setItem(`troubleshooting_${sessionId}`, JSON.stringify(session));
    return true;
  } catch (e) {
    console.error('Failed to add troubleshooting step:', e);
    return false;
  }
}

/**
 * Get all troubleshooting sessions
 */
export function getAllTroubleshootingSessions(): TroubleshootingSession[] {
  try {
    const sessions: TroubleshootingSession[] = [];
    
    // Look through localStorage for troubleshooting sessions
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('troubleshooting_')) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const session = JSON.parse(data) as TroubleshootingSession;
            sessions.push(session);
          }
        } catch (e) {
          console.warn('Failed to parse troubleshooting session:', e);
        }
      }
    }
    
    return sessions;
  } catch (e) {
    console.error('Failed to get troubleshooting sessions:', e);
    return [];
  }
}
