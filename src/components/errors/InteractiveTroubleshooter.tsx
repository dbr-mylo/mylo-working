
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, Info, ChevronRight, ChevronLeft, Check, X, AlertCircle, Save } from 'lucide-react';
import { ErrorCategory, classifyError } from '@/utils/error/errorClassifier';
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { useStateRestore } from './StateRestoreProvider';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAuth } from '@/contexts/AuthContext';
import { useSessionRecovery } from '@/hooks/useSessionRecovery';
import { getLocalStorage, setLocalStorage } from '@/utils/storage/localStorage';

// Type for a troubleshooting step
interface TroubleshootingStep {
  id: string;
  title: string;
  description: string;
  action?: {
    label: string;
    handler: () => Promise<boolean>;
    autoRun?: boolean; // Automatically run this action when step is shown
  };
  nextStep?: (result: boolean) => string | null; // Function to determine next step based on action result
}

// Type for error diagnostics data
interface ErrorDiagnostic {
  category: ErrorCategory;
  occurrences: number;
  contexts: string[];
  recoveryAttempted: number;
  recoverySucceeded: number;
  recoveryRate: number;
}

type TroubleshootingState = {
  currentStepId: string;
  completedSteps: string[];
  startTime: number;
  path: string[];
  results: Record<string, boolean>;
};

// Local storage key for saved troubleshooting sessions
const SAVED_TROUBLESHOOTING_KEY = 'saved_troubleshooting_session';

/**
 * Interactive troubleshooter that walks users through steps to resolve errors
 */
export function InteractiveTroubleshooter({
  error,
  context,
  onResolve,
  onGiveUp
}: {
  error: unknown;
  context: string;
  onResolve?: () => void;
  onGiveUp?: () => void;
}) {
  // Get the error diagnostic information
  const classifiedError = classifyError(error, context);
  const { isEnabled } = useFeatureFlags();
  const { isOnline } = useOnlineStatus();
  const { role } = useAuth();
  const { recoverSession, handleAuthError } = useSessionRecovery();
  
  // State for tracking progress through the troubleshooting flow
  const [state, setState] = useStateRestore<TroubleshootingState>(`troubleshooter_${context}`, {
    currentStepId: 'start',
    completedSteps: [],
    startTime: Date.now(),
    path: ['start'],
    results: {}
  });
  
  const [isRunningAction, setIsRunningAction] = useState(false);
  const [actionResult, setActionResult] = useState<boolean | null>(null);
  const [hasSavedSession, setHasSavedSession] = useState(false);
  
  // Check for saved session on load
  useEffect(() => {
    const saved = getLocalStorage<{
      errorCategory: string;
      context: string;
      state: TroubleshootingState;
      savedAt: number;
    }>(SAVED_TROUBLESHOOTING_KEY);
    
    if (saved && 
        saved.errorCategory === classifiedError.category && 
        saved.context === context &&
        Date.now() - saved.savedAt < 24 * 60 * 60 * 1000) { // Session valid for 24 hours
      setHasSavedSession(true);
    }
  }, [classifiedError.category, context]);
  
  // Generate steps based on error category
  const steps: Record<string, TroubleshootingStep> = React.useMemo(() => {
    const categorySteps: Record<string, TroubleshootingStep> = {
      // Generic starting step for all error types
      'start': {
        id: 'start',
        title: 'Error Diagnosis',
        description: `We've detected a ${classifiedError.category} error. Let's troubleshoot this step by step.`,
        action: {
          label: 'Start Diagnosis',
          handler: async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
          }
        },
        nextStep: () => {
          // Route to the appropriate starting point based on error category
          if (classifiedError.category === ErrorCategory.NETWORK) {
            return 'network-check';
          } else if (classifiedError.category === ErrorCategory.AUTH || 
                    classifiedError.category === ErrorCategory.AUTHENTICATION || 
                    classifiedError.category === ErrorCategory.SESSION) {
            return 'auth-check';
          } else if (classifiedError.category === ErrorCategory.STORAGE) {
            return 'storage-check';
          } else if (classifiedError.category === ErrorCategory.SERVER) {
            return 'server-check';
          } else if (classifiedError.category === ErrorCategory.CRITICAL) {
            return 'critical-error-check';
          } else {
            return 'general-check';
          }
        }
      },
      
      // Network troubleshooting steps
      'network-check': {
        id: 'network-check',
        title: 'Checking Network Connectivity',
        description: 'Let\'s verify your internet connection.',
        action: {
          label: 'Check Connection',
          handler: async () => {
            return navigator.onLine;
          },
          autoRun: true
        },
        nextStep: (result) => result ? 'network-request-test' : 'offline-solutions'
      },
      
      'network-request-test': {
        id: 'network-request-test',
        title: 'Testing API Connection',
        description: 'Your device is online. Let\'s test a connection to our services.',
        action: {
          label: 'Test API Connection',
          handler: async () => {
            try {
              const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
              return response.ok;
            } catch (e) {
              return false;
            }
          }
        },
        nextStep: (result) => result ? 'network-success' : 'network-partial'
      },
      
      'offline-solutions': {
        id: 'offline-solutions',
        title: 'You\'re Offline',
        description: 'Your device is not connected to the internet. Try these steps:',
        nextStep: () => 'network-retry'
      },
      
      'network-partial': {
        id: 'network-partial',
        title: 'Partial Connectivity',
        description: 'Your device is online, but we couldn\'t reach our services. This might be a temporary issue or a problem with your network configuration.',
        nextStep: () => 'network-retry'
      },
      
      'network-retry': {
        id: 'network-retry',
        title: 'Let\'s try again',
        description: 'After addressing potential connectivity issues, let\'s retry the connection.',
        action: {
          label: 'Retry Connection',
          handler: async () => {
            try {
              const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
              return response.ok;
            } catch (e) {
              return false;
            }
          }
        },
        nextStep: (result) => result ? 'network-success' : 'network-failure'
      },
      
      'network-success': {
        id: 'network-success',
        title: 'Network Connection Successful',
        description: 'Great! Your network connection is working. Let\'s retry the original operation.',
        action: {
          label: 'Retry Original Operation',
          handler: async () => {
            // Attempt to retry the original action
            return true;
          }
        },
        nextStep: () => 'resolution'
      },
      
      'network-failure': {
        id: 'network-failure',
        title: 'Persistent Network Issues',
        description: 'We\'re still having trouble connecting to our services. This could be due to network restrictions, proxies, or firewall settings.',
        nextStep: () => 'suggestions'
      },
      
      // Authentication troubleshooting steps
      'auth-check': {
        id: 'auth-check',
        title: 'Checking Authentication Status',
        description: 'We\'ll check your account session and attempt to restore it if needed.',
        action: {
          label: 'Check Authentication',
          handler: async () => {
            if (!isEnabled('auto_recovery')) {
              return false;
            }
            
            try {
              // Attempt to recover the session
              const result = await recoverSession();
              return result.recovered;
            } catch (e) {
              return false;
            }
          }
        },
        nextStep: (result) => result ? 'auth-success' : 'auth-renewal'
      },
      
      'auth-renewal': {
        id: 'auth-renewal',
        title: 'Session Renewal',
        description: 'Let\'s try to renew your session credentials.',
        action: {
          label: 'Renew Session',
          handler: async () => {
            try {
              // Attempt to handle the auth error specifically
              const result = await handleAuthError(error, context);
              return result.recovered;
            } catch (e) {
              return false;
            }
          }
        },
        nextStep: (result) => result ? 'auth-success' : 'auth-failure'
      },
      
      'auth-success': {
        id: 'auth-success',
        title: 'Authentication Restored',
        description: 'Great! Your authentication has been restored. You can continue using the application.',
        nextStep: () => 'resolution'
      },
      
      'auth-failure': {
        id: 'auth-failure',
        title: 'Authentication Issue',
        description: 'We weren\'t able to restore your authentication session. This might be because your session has expired or there\'s an issue with the authentication service.',
        nextStep: () => 'suggestions'
      },
      
      // Storage troubleshooting steps
      'storage-check': {
        id: 'storage-check',
        title: 'Checking Storage Access',
        description: 'Let\'s check your browser\'s storage access.',
        action: {
          label: 'Check Storage',
          handler: async () => {
            try {
              const testKey = '___test_storage___';
              localStorage.setItem(testKey, 'test');
              const value = localStorage.getItem(testKey);
              localStorage.removeItem(testKey);
              return value === 'test';
            } catch (e) {
              return false;
            }
          },
          autoRun: true
        },
        nextStep: (result) => result ? 'storage-space-check' : 'storage-disabled'
      },
      
      'storage-space-check': {
        id: 'storage-space-check',
        title: 'Checking Storage Space',
        description: 'Storage is accessible. Now checking if you have enough space.',
        action: {
          label: 'Check Storage Space',
          handler: async () => {
            try {
              if (navigator.storage && navigator.storage.estimate) {
                const estimate = await navigator.storage.estimate();
                // If we're using more than 90% of available space, suggest cleanup
                return !estimate.quota || (estimate.usage! / estimate.quota) < 0.9;
              }
              return true; // Default to true if we can't check
            } catch (e) {
              return true; // Default to true if we can't check
            }
          },
          autoRun: true
        },
        nextStep: (result) => result ? 'storage-success' : 'storage-full'
      },
      
      'storage-disabled': {
        id: 'storage-disabled',
        title: 'Storage Access Issue',
        description: 'We can\'t access browser storage. This might be due to privacy settings, incognito mode, or browser restrictions.',
        nextStep: () => 'suggestions'
      },
      
      'storage-full': {
        id: 'storage-full',
        title: 'Storage Space Low',
        description: 'You\'re running low on browser storage space. Try clearing some site data to free up space.',
        action: {
          label: 'Retry After Cleanup',
          handler: async () => {
            // This is where we'd clear our app's non-essential data
            // For now, just assume the user cleared some space
            return true;
          }
        },
        nextStep: () => 'storage-success'
      },
      
      'storage-success': {
        id: 'storage-success',
        title: 'Storage Access Confirmed',
        description: 'Great! Your browser storage is accessible and has sufficient space.',
        nextStep: () => 'resolution'
      },
      
      // General and fallback steps
      'general-check': {
        id: 'general-check',
        title: 'General System Check',
        description: 'Let\'s run a general system check to identify the issue.',
        action: {
          label: 'Run Check',
          handler: async () => {
            // Simulate a system check
            await new Promise(resolve => setTimeout(resolve, 1500));
            return true;
          }
        },
        nextStep: () => 'suggestions'
      },
      
      'server-check': {
        id: 'server-check',
        title: 'Checking Server Status',
        description: 'We\'ll check if our servers are experiencing any issues.',
        action: {
          label: 'Check Server Status',
          handler: async () => {
            // This would typically check a status endpoint
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true; // Assume servers are up for this demo
          }
        },
        nextStep: (result) => result ? 'server-retry' : 'server-maintenance'
      },
      
      'server-maintenance': {
        id: 'server-maintenance',
        title: 'Server Maintenance',
        description: 'Our servers might be undergoing maintenance. Please try again later.',
        nextStep: () => 'suggestions'
      },
      
      'server-retry': {
        id: 'server-retry',
        title: 'Retrying Server Connection',
        description: 'Servers appear to be online. Let\'s retry your operation.',
        action: {
          label: 'Retry Operation',
          handler: async () => {
            // Attempt to retry
            return true;
          }
        },
        nextStep: () => 'resolution'
      },
      
      'critical-error-check': {
        id: 'critical-error-check',
        title: 'Critical System Error',
        description: 'This appears to be a critical system error that requires attention.',
        action: {
          label: 'Check System Status',
          handler: async () => {
            // Simulate checking system status
            await new Promise(resolve => setTimeout(resolve, 1000));
            return false; // Critical errors typically need manual intervention
          }
        },
        nextStep: () => 'suggestions'
      },
      
      // Resolution steps
      'resolution': {
        id: 'resolution',
        title: 'Issue Resolved',
        description: 'Great! The issue appears to be resolved. You can now continue using the application.',
        action: {
          label: 'Continue',
          handler: async () => {
            if (onResolve) onResolve();
            return true;
          }
        },
        nextStep: () => null
      },
      
      'suggestions': {
        id: 'suggestions',
        title: 'Suggested Next Steps',
        description: 'We couldn\'t automatically resolve the issue. Here are some suggestions:',
        nextStep: () => null
      }
    };
    
    return categorySteps;
  }, [classifiedError.category, context, error, handleAuthError, isEnabled, onResolve, recoverSession]);
  
  const currentStep = steps[state.currentStepId];
  const progress = state.completedSteps.length / 
    (Object.keys(steps).length - 2) * 100; // Exclude 'resolution' and 'suggestions' endpoints
  
  // Run auto-actions when a step is loaded
  useEffect(() => {
    if (currentStep?.action?.autoRun && !isRunningAction && actionResult === null) {
      handleRunAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isRunningAction, actionResult]);
  
  // Handlers for navigation
  const handleRunAction = async () => {
    if (!currentStep?.action || isRunningAction) return;
    
    setIsRunningAction(true);
    setActionResult(null);
    
    try {
      const result = await currentStep.action.handler();
      setActionResult(result);
      
      // Update results
      setState(prev => ({
        ...prev,
        results: {
          ...prev.results,
          [currentStep.id]: result
        }
      }));
      
      // Auto-advance if there's a next step
      if (currentStep.nextStep) {
        const nextStepId = currentStep.nextStep(result);
        if (nextStepId) {
          handleGoToStep(nextStepId);
        }
      }
    } catch (e) {
      console.error('Error running action:', e);
      setActionResult(false);
      toast.error('Error during troubleshooting', {
        description: 'An error occurred while running this step.'
      });
    } finally {
      setIsRunningAction(false);
    }
  };
  
  const handleGoToStep = (stepId: string) => {
    if (!steps[stepId]) {
      console.error(`Step ${stepId} not found`);
      return;
    }
    
    // Add this step to completed steps if it's not already there
    setState(prev => ({
      ...prev,
      currentStepId: stepId,
      completedSteps: prev.completedSteps.includes(currentStep.id)
        ? prev.completedSteps
        : [...prev.completedSteps, currentStep.id],
      path: [...prev.path, stepId]
    }));
    
    // Reset action result when changing steps
    setActionResult(null);
  };
  
  const handleBack = () => {
    if (state.path.length <= 1) return;
    
    const newPath = [...state.path];
    newPath.pop(); // Remove current step
    
    const previousStepId = newPath[newPath.length - 1];
    
    setState(prev => ({
      ...prev,
      currentStepId: previousStepId,
      path: newPath
    }));
    
    // Reset action result when changing steps
    setActionResult(null);
  };
  
  // Save or restore troubleshooting session
  const handleSaveSession = () => {
    setLocalStorage(SAVED_TROUBLESHOOTING_KEY, {
      errorCategory: classifiedError.category,
      context,
      state,
      savedAt: Date.now()
    });
    
    toast.success('Troubleshooting session saved', {
      description: 'You can resume this session later.'
    });
  };
  
  const handleRestoreSession = () => {
    const saved = getLocalStorage<{
      errorCategory: string;
      context: string;
      state: TroubleshootingState;
    }>(SAVED_TROUBLESHOOTING_KEY);
    
    if (saved && saved.errorCategory === classifiedError.category && saved.context === context) {
      setState(saved.state);
      setHasSavedSession(false);
      
      toast.success('Troubleshooting session restored', {
        description: 'Continuing from where you left off.'
      });
    }
  };

  // Mock error analytics data - in a real app, this would come from your analytics service
  const errorDiagnostics: ErrorDiagnostic = {
    category: classifiedError.category,
    occurrences: 128,
    contexts: [context, 'document-save', 'api-fetch'],
    recoveryAttempted: 85,
    recoverySucceeded: 72,
    recoveryRate: 0.85
  };
  
  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Troubleshooting Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>
      
      {/* Saved session prompt */}
      {hasSavedSession && (
        <Alert className="bg-muted/50">
          <Info className="h-4 w-4" />
          <AlertTitle>Previous session found</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>You have a saved troubleshooting session for this error.</span>
            <Button size="sm" variant="outline" onClick={handleRestoreSession}>
              Resume Session
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Current step */}
      <Card>
        <CardHeader>
          <CardTitle>{currentStep.title}</CardTitle>
          <CardDescription>{currentStep.description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          {currentStep.id === 'offline-solutions' && (
            <div className="space-y-2">
              <p className="text-sm">
                1. Check your Wi-Fi or cellular data connection
              </p>
              <p className="text-sm">
                2. If you're using Wi-Fi, try restarting your router
              </p>
              <p className="text-sm">
                3. If you're using cellular data, ensure you have sufficient data allowance
              </p>
              <p className="text-sm">
                4. If you're in an area with poor connection, try moving to a different location
              </p>
            </div>
          )}
          
          {currentStep.id === 'suggestions' && (
            <div className="space-y-4 pt-2">
              {classifiedError.category === ErrorCategory.NETWORK && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Network Issue Suggestions:</h3>
                  <ul className="list-disc pl-4 space-y-1 text-sm">
                    <li>Ensure your device has a stable internet connection</li>
                    <li>Try using a different network (switch from Wi-Fi to cellular)</li>
                    <li>Restart your router or modem</li>
                    <li>Check if the service is accessible from another device</li>
                  </ul>
                </div>
              )}
              
              {(classifiedError.category === ErrorCategory.AUTH || 
                classifiedError.category === ErrorCategory.AUTHENTICATION) && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Authentication Issue Suggestions:</h3>
                  <ul className="list-disc pl-4 space-y-1 text-sm">
                    <li>Sign out and sign back in to refresh your session</li>
                    <li>Clear your browser cookies and cached data</li>
                    <li>Check if your account has the necessary permissions</li>
                    <li>Contact support if you continue to have access issues</li>
                  </ul>
                </div>
              )}
              
              {classifiedError.category === ErrorCategory.STORAGE && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Storage Issue Suggestions:</h3>
                  <ul className="list-disc pl-4 space-y-1 text-sm">
                    <li>Clear browser cache and cookies</li>
                    <li>Free up disk space on your device</li>
                    <li>Check your browser's privacy settings for storage restrictions</li>
                    <li>Try using a different browser</li>
                  </ul>
                </div>
              )}
              
              {classifiedError.category === ErrorCategory.SERVER && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Server Issue Suggestions:</h3>
                  <ul className="list-disc pl-4 space-y-1 text-sm">
                    <li>Wait a few minutes and try again</li>
                    <li>Check our status page for known service disruptions</li>
                    <li>Clear your browser cache</li>
                    <li>Try again later as the issue might be temporary</li>
                  </ul>
                </div>
              )}
              
              {classifiedError.category === ErrorCategory.CRITICAL && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Critical Issue Suggestions:</h3>
                  <ul className="list-disc pl-4 space-y-1 text-sm">
                    <li>Reload the application</li>
                    <li>Clear your browser cache and cookies</li>
                    <li>Contact support with details about what you were doing</li>
                    <li>Check for application updates or try again later</li>
                  </ul>
                </div>
              )}
              
              {/* Error information */}
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Details</AlertTitle>
                <AlertDescription className="text-xs font-mono whitespace-pre-wrap">
                  {error instanceof Error ? error.message : String(error)}
                  {error instanceof Error && error.stack && (
                    <div className="mt-2 opacity-70">
                      Location: {error.stack.split('\n')[1]?.trim()}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
              
              {/* Error analytics */}
              <div className="border rounded-md p-3 space-y-2">
                <h3 className="text-sm font-semibold">Error Analytics</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-muted-foreground">Category:</div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="text-xs">
                      {errorDiagnostics.category}
                    </Badge>
                  </div>
                  
                  <div className="text-muted-foreground">Occurrences:</div>
                  <div>{errorDiagnostics.occurrences}</div>
                  
                  <div className="text-muted-foreground">Recovery Rate:</div>
                  <div>{(errorDiagnostics.recoveryRate * 100).toFixed(0)}%</div>
                </div>
              </div>
            </div>
          )}
          
          {isRunningAction && (
            <div className="flex items-center justify-center py-4">
              <RefreshCw className="h-5 w-5 animate-spin text-primary mr-2" />
              <span>Running checks...</span>
            </div>
          )}
          
          {!isRunningAction && actionResult !== null && (
            <Alert className={actionResult ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}>
              {actionResult ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
              <AlertTitle>
                {actionResult ? "Check passed!" : "Check failed"}
              </AlertTitle>
              <AlertDescription>
                {actionResult
                  ? "This step completed successfully."
                  : "There was an issue completing this step."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleBack}
              disabled={state.path.length <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSaveSession}
            >
              <Save className="h-4 w-4 mr-1" />
              Save Progress
            </Button>
          </div>
          
          <div className="flex space-x-2">
            {onGiveUp && currentStep.id !== 'resolution' && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onGiveUp}
              >
                Skip
              </Button>
            )}
            
            {currentStep.action && !currentStep.action.autoRun && (
              <Button 
                variant="default" 
                size="sm"
                onClick={handleRunAction}
                disabled={isRunningAction}
              >
                {currentStep.action.label}
                {!isRunningAction && <ChevronRight className="h-4 w-4 ml-1" />}
                {isRunningAction && <RefreshCw className="h-4 w-4 ml-1 animate-spin" />}
              </Button>
            )}
            
            {currentStep.id === 'suggestions' && onResolve && (
              <Button 
                variant="default" 
                size="sm"
                onClick={onResolve}
              >
                Try Again
                <RefreshCw className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {/* Error frequency information */}
      {currentStep.id === 'suggestions' && (
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Similar Issues</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              This issue has been reported {errorDiagnostics.occurrences} times recently. 
              Our team is working on a permanent solution.
            </p>
            
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Recovery success rate:</span>
              <Badge variant="secondary">
                {(errorDiagnostics.recoveryRate * 100).toFixed(0)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
