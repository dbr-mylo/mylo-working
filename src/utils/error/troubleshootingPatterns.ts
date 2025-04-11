
/**
 * Error pattern recognition and troubleshooting
 */

import { ErrorCategory, ClassifiedError, classifyError } from "./errorClassifier";

// Interfaces for troubleshooting
export interface TroubleshootingPattern {
  id: string;
  name: string;
  categoryMatches: ErrorCategory[];
  messagePatterns: RegExp[];
  steps: string[];
  automatedChecks: AutomatedCheck[];
  successRate: number;
  lastUpdated: string;
}

export interface AutomatedCheck {
  id: string;
  name: string;
  description: string;
  checkFn: () => Promise<boolean>;
  remedyFn?: () => Promise<boolean>;
}

// Known troubleshooting patterns
const troubleshootingPatterns: TroubleshootingPattern[] = [
  {
    id: 'network-connectivity',
    name: 'Network Connectivity Issues',
    categoryMatches: [ErrorCategory.NETWORK, ErrorCategory.TIMEOUT],
    messagePatterns: [
      /failed to fetch/i,
      /network error/i,
      /connection (failed|error|lost)/i,
      /offline/i
    ],
    steps: [
      'Check your internet connection',
      'Verify that you can access other websites',
      'Try disabling any VPN or proxy services',
      'Clear your browser cache and cookies',
      'If on a mobile device, try switching between Wi-Fi and cellular data'
    ],
    automatedChecks: [
      {
        id: 'online-status',
        name: 'Online Status',
        description: 'Checks if your device reports being online',
        checkFn: async () => {
          return navigator.onLine;
        }
      },
      {
        id: 'ping-service',
        name: 'API Connectivity',
        description: 'Checks if our API services are reachable',
        checkFn: async () => {
          try {
            const response = await fetch('/api/health', { method: 'HEAD' });
            return response.ok;
          } catch (e) {
            return false;
          }
        }
      }
    ],
    successRate: 0.85,
    lastUpdated: '2025-03-15'
  },
  {
    id: 'authentication-issues',
    name: 'Authentication Problems',
    categoryMatches: [ErrorCategory.AUTHENTICATION, ErrorCategory.AUTHORIZATION],
    messagePatterns: [
      /unauthorized/i,
      /not authenticated/i,
      /invalid (token|credentials)/i,
      /login (required|failed)/i,
      /session (expired|invalid)/i
    ],
    steps: [
      'Log out and log back in',
      'Clear your browser cache and cookies',
      'Check if you are using the correct credentials',
      'Reset your password if you continue to have issues',
      'Make sure your account has not been locked or disabled'
    ],
    automatedChecks: [
      {
        id: 'token-check',
        name: 'Auth Token',
        description: 'Checks if you have a valid authentication token',
        checkFn: async () => {
          return localStorage.getItem('auth_token') !== null;
        },
        remedyFn: async () => {
          // In a real app, we'd redirect to login
          console.log('Redirecting to login page...');
          return true;
        }
      }
    ],
    successRate: 0.92,
    lastUpdated: '2025-04-02'
  },
  {
    id: 'storage-issues',
    name: 'Storage Access Problems',
    categoryMatches: [ErrorCategory.STORAGE],
    messagePatterns: [
      /quota exceeded/i,
      /storage (error|full|unavailable)/i,
      /indexeddb (error|failed)/i,
      /local storage (error|failed|unavailable)/i
    ],
    steps: [
      'Clear some browser storage space',
      'Check your browser settings to ensure storage access is allowed',
      'Try using a different browser',
      'If using private/incognito mode, try regular browsing mode instead',
      'Ensure you have sufficient disk space on your device'
    ],
    automatedChecks: [
      {
        id: 'storage-access',
        name: 'Storage Access',
        description: 'Checks if localStorage is accessible',
        checkFn: async () => {
          try {
            const testKey = '___test_storage_access___';
            localStorage.setItem(testKey, 'test');
            const value = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            return value === 'test';
          } catch (e) {
            return false;
          }
        }
      }
    ],
    successRate: 0.78,
    lastUpdated: '2025-03-28'
  }
];

/**
 * Find matching troubleshooting patterns for an error
 * @param error The error to match patterns for
 * @returns Matching troubleshooting patterns
 */
export function findMatchingPatterns(error: unknown): TroubleshootingPattern[] {
  const classified = classifyError(error);
  const errorMessage = classified.message.toLowerCase();
  
  // Find patterns that match the error category or message patterns
  return troubleshootingPatterns.filter(pattern => {
    // Check if category matches
    const categoryMatch = pattern.categoryMatches.includes(classified.category as any);
    
    // Check if any message patterns match
    const messageMatch = pattern.messagePatterns.some(regex => 
      regex.test(errorMessage)
    );
    
    return categoryMatch || messageMatch;
  });
}

/**
 * Run automated checks for a troubleshooting pattern
 * @param pattern The troubleshooting pattern
 * @returns Results of the automated checks
 */
export async function runAutomatedChecks(pattern: TroubleshootingPattern): Promise<{
  id: string;
  name: string;
  passed: boolean;
  remedy?: () => Promise<boolean>;
}[]> {
  const results = [];
  
  for (const check of pattern.automatedChecks) {
    try {
      const passed = await check.checkFn();
      
      results.push({
        id: check.id,
        name: check.name,
        passed,
        remedy: !passed && check.remedyFn ? check.remedyFn : undefined
      });
    } catch (e) {
      console.error(`Failed to run check ${check.id}:`, e);
      results.push({
        id: check.id,
        name: check.name,
        passed: false
      });
    }
  }
  
  return results;
}

/**
 * Get all known troubleshooting patterns
 * @returns Array of troubleshooting patterns
 */
export function getAllPatterns(): TroubleshootingPattern[] {
  return troubleshootingPatterns;
}
