
/**
 * Creates a role-specific error message
 * @param error The error to handle
 * @param role The user's role
 * @param context Context information about where the error occurred
 * @returns An error message tailored to the user's role
 */
export function getRoleSpecificErrorMessage(
  error: unknown,
  role: string | null | undefined,
  context: string
): string {
  const baseMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  
  // First check for specific context-role combinations
  if (context.includes('template') || context.includes('design')) {
    if (role === 'designer') {
      return `Design system error: ${baseMessage}. This may affect template rendering. You can try refreshing the styles registry.`;
    } else if (role === 'writer') {
      return `Template error: ${baseMessage}. Please contact a designer if this persists.`;
    } else if (role === 'admin') {
      return `Template system error: ${baseMessage}. Check the style registry and template cache for inconsistencies.`;
    }
  }
  
  if (context.includes('document') || context.includes('editor')) {
    if (role === 'writer') {
      return `Document error: ${baseMessage}. Your content is safely backed up.`;
    } else if (role === 'designer') {
      return `Editor error: ${baseMessage}. This might be related to style definitions.`;
    } else if (role === 'admin') {
      return `Document system error: ${baseMessage}. Check editor logs for detailed debugging information.`;
    }
  }
  
  if (context.includes('auth') || context.includes('permission')) {
    if (role) {
      return `Access error: ${baseMessage}. You're currently logged in as ${role}.`;
    } else {
      return `Authentication error: ${baseMessage}. Please try logging in again.`;
    }
  }
  
  if (context.includes('api') || context.includes('fetch') || context.includes('service')) {
    if (role === 'admin') {
      return `API error in ${context}: ${baseMessage}. Check server logs and API status.`;
    } else {
      return `Connection error: ${baseMessage}. Please try again or contact support if this persists.`;
    }
  }
  
  if (context.includes('backup') || context.includes('recovery')) {
    return `Data recovery error: ${baseMessage}. Your work is still safe, but automatic backup may not be working correctly.`;
  }
  
  // Fall back to general role-based messaging
  switch (role) {
    case 'designer':
      return `Design error in ${context}: ${baseMessage}. You may need to check your style configurations.`;
    case 'writer':
      return `Content error in ${context}: ${baseMessage}. Your content is still safe.`;
    case 'admin':
      return `System error in ${context}: ${baseMessage}. Technical details have been logged.`;
    default:
      return `Error in ${context}: ${baseMessage}`;
  }
}

/**
 * Get error resolution steps specific to a user role
 * 
 * @param error The error that occurred
 * @param role The user's role
 * @param context Context information about where the error occurred
 * @returns Array of resolution steps
 */
export function getRoleSpecificResolutionSteps(
  error: unknown,
  role: string | null | undefined,
  context: string
): string[] {
  // Default steps for all users
  const defaultSteps = [
    'Try refreshing the page',
    'Check your internet connection',
    'Try the operation again'
  ];
  
  // For unauthenticated users, suggest logging in
  if (!role) {
    return [
      'Log in to your account',
      ...defaultSteps,
      'Contact support if the issue persists'
    ];
  }
  
  // Role-specific steps
  switch (role) {
    case 'designer':
      return [
        'Check if your template definitions are valid',
        'Try rebuilding the style cache',
        'Ensure your design elements follow the style guidelines',
        ...defaultSteps
      ];
    case 'writer':
      return [
        'Check if the document has been saved properly',
        'Try using a different browser',
        'Clear your browser cache',
        ...defaultSteps
      ];
    case 'admin':
      return [
        'Check server logs for detailed error information',
        'Verify service status in the admin dashboard',
        'Review recent system changes',
        'Reset the application cache',
        ...defaultSteps
      ];
    default:
      return defaultSteps;
  }
}
