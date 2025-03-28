
import React from 'react';
import { GuidedResolution } from './GuidedResolution';

/**
 * Create a guided error resolution component
 * @param error The error to resolve
 * @param resolutionSteps Steps to resolve the error
 */
export function createGuidedResolution(
  error: unknown, 
  resolutionSteps: string[]
): React.ReactElement {
  return <GuidedResolution error={error} resolutionSteps={resolutionSteps} />;
}

/**
 * Get resolution steps for common errors
 * @param error The error to get resolution steps for
 * @param context The context where the error occurred
 */
export function getErrorResolutionSteps(
  error: unknown, 
  context: string
): string[] {
  // Default steps for generic errors
  let steps = [
    "Refresh the page and try again.",
    "Check your internet connection.",
    "Clear your browser cache.",
    "If the problem persists, contact support."
  ];
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Customize steps based on error type and context
  if (errorMessage.includes("permission") || errorMessage.includes("access")) {
    steps = [
      "Verify you have the correct permissions.",
      "Try logging out and logging back in.",
      "Contact an administrator if you need access."
    ];
  } else if (errorMessage.includes("timeout") || errorMessage.includes("network")) {
    steps = [
      "Check your internet connection.",
      "Try again in a few moments.",
      "If using a VPN, try disabling it temporarily."
    ];
  } else if (context.includes("auth") || context.includes("login")) {
    steps = [
      "Verify your credentials are correct.",
      "Reset your password if you're having trouble.",
      "Check if your account is locked or disabled."
    ];
  } else if (context.includes("document") || context.includes("save")) {
    steps = [
      "Check if you have unsaved changes.",
      "Try saving with a different name.",
      "Ensure you have sufficient permissions for this document."
    ];
  }
  
  return steps;
}
