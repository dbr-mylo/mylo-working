
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
