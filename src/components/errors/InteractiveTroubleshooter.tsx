import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, RefreshCw, Info, HelpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { classifyError, ErrorCategory } from '@/utils/error/errorClassifier';
import { getErrorCategoryInfo } from '@/utils/error/selfHealingSystem';

interface TroubleshootingStep {
  id: string;
  title: string;
  description: string;
  options?: {
    id: string;
    label: string;
    nextStep: string;
    action?: () => Promise<void>;
  }[];
  content?: React.ReactNode;
  isTerminal?: boolean;
  autoAction?: () => Promise<{
    success: boolean;
    message?: string;
    nextStep?: string;
  }>;
}

interface InteractiveTroubleshooterProps {
  error: Error | unknown;
  context: string;
  onResolve?: () => void;
  onGiveUp?: () => void;
}

/**
 * Interactive troubleshooting wizard for resolving errors
 */
export function InteractiveTroubleshooter({
  error,
  context,
  onResolve,
  onGiveUp
}: InteractiveTroubleshooterProps) {
  const [currentStepId, setCurrentStepId] = useState<string>('start');
  const [stepHistory, setStepHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<'pending' | 'resolved' | 'failed'>('pending');
  
  // Classify the error to determine troubleshooting flow
  const classifiedError = classifyError(error, context);
  const errorInfo = getErrorCategoryInfo(classifiedError.category);
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Define troubleshooting steps based on error category
  const steps: Record<string, TroubleshootingStep> = getStepsForErrorCategory(classifiedError.category, error, context);
  
  // Current step
  const currentStep = steps[currentStepId];
  
  const handleNext = async (optionId?: string) => {
    if (!currentStep) return;
    
    const selectedOptionObj = optionId && currentStep.options ? 
      currentStep.options.find(o => o.id === optionId) : null;
    
    // Save current step to history
    setStepHistory(prev => [...prev, currentStepId]);
    
    if (selectedOptionObj) {
      setIsLoading(true);
      
      try {
        // Execute option action if available
        if (selectedOptionObj.action) {
          await selectedOptionObj.action();
        }
        
        // Navigate to next step
        setCurrentStepId(selectedOptionObj.nextStep);
        setSelectedOption(null);
      } catch (error) {
        console.error('Error executing step action:', error);
        toast.error('Error during troubleshooting', {
          description: 'There was a problem executing the selected action.'
        });
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep.autoAction) {
      setIsLoading(true);
      
      try {
        const result = await currentStep.autoAction();
        
        if (result.message) {
          if (result.success) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
        }
        
        if (result.nextStep) {
          setCurrentStepId(result.nextStep);
        } else if (result.success && steps['success']) {
          setCurrentStepId('success');
        } else if (!result.success && steps['failure']) {
          setCurrentStepId('failure');
        }
      } catch (error) {
        console.error('Error in auto action:', error);
        toast.error('Error during troubleshooting action');
        
        if (steps['failure']) {
          setCurrentStepId('failure');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleBack = () => {
    if (stepHistory.length === 0) return;
    
    const previousStep = stepHistory[stepHistory.length - 1];
    setCurrentStepId(previousStep);
    setStepHistory(prev => prev.slice(0, -1));
    setSelectedOption(null);
  };
  
  const handleRestart = () => {
    setCurrentStepId('start');
    setStepHistory([]);
    setSelectedOption(null);
    setResolutionStatus('pending');
  };
  
  const handleComplete = (success: boolean) => {
    setResolutionStatus(success ? 'resolved' : 'failed');
    
    if (success && onResolve) {
      onResolve();
    } else if (!success && onGiveUp) {
      onGiveUp();
    }
  };
  
  if (!currentStep) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Error</CardTitle>
          <CardDescription>
            Could not find appropriate troubleshooting steps for this error.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Unknown error type</AlertTitle>
            <AlertDescription>
              We cannot provide guided troubleshooting for this specific error.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" onClick={onGiveUp}>
            Close
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{currentStep.title}</CardTitle>
            <CardDescription>{currentStep.description}</CardDescription>
          </div>
          {!currentStep.isTerminal && (
            <Button variant="ghost" size="icon" onClick={handleRestart}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="pt-6">
        {/* Error information if this is the start step */}
        {currentStepId === 'start' && (
          <div className="mb-6 space-y-4">
            <Alert variant={classifiedError.category === ErrorCategory.CRITICAL ? "destructive" : "default"}>
              <Info className="h-4 w-4" />
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription className="font-mono text-sm">
                {errorMessage}
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-wrap gap-2">
              <ErrorBadge variant="outline" category={classifiedError.category} />
              {errorInfo.recoveryRate > 0.5 && (
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                  Common Issue
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className="space-y-4">
          {currentStep.content}
          
          {/* Options selection */}
          {currentStep.options && (
            <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
              <div className="space-y-2">
                {currentStep.options.map(option => (
                  <div key={option.id} className="flex items-start space-x-2 border rounded-lg p-3">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
          
          {/* Terminal step content */}
          {currentStep.isTerminal && currentStep.id === 'success' && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">
                The issue has been resolved successfully.
              </AlertDescription>
            </Alert>
          )}
          
          {currentStep.isTerminal && currentStep.id === 'failure' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Troubleshooting Failed</AlertTitle>
              <AlertDescription>
                We couldn't automatically resolve the issue. Consider reaching out to support.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {/* Back button (if we have history) */}
        {stepHistory.length > 0 && !currentStep.isTerminal && (
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}
        
        <div className="flex-1"></div>
        
        {/* Terminal buttons */}
        {currentStep.isTerminal && (
          <div className="space-x-2">
            {currentStep.id === 'success' ? (
              <Button 
                variant="default" 
                onClick={() => handleComplete(true)}
                disabled={isLoading}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Complete
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => handleComplete(false)}
                  disabled={isLoading}
                >
                  Give Up
                </Button>
                <Button 
                  variant="default" 
                  onClick={handleRestart}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Try Again
                </Button>
              </>
            )}
          </div>
        )}
        
        {/* Next button for option selection */}
        {currentStep.options && (
          <Button 
            variant="default"
            onClick={() => handleNext(selectedOption || undefined)}
            disabled={!selectedOption || isLoading}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
        
        {/* Continue button for auto-action steps */}
        {currentStep.autoAction && !currentStep.isTerminal && (
          <Button 
            variant="default"
            onClick={() => handleNext()}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue'}
            {!isLoading && <ArrowRight className="h-4 w-4 ml-1" />}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// Helper components
function ErrorBadge({ category, variant }: { category?: ErrorCategory, variant: "outline" | "secondary" }) {
  const getColorByCategory = () => {
    if (!category) return "bg-gray-100 text-gray-800 border-gray-200";
    
    switch (category) {
      case ErrorCategory.NETWORK:
        return "bg-blue-50 text-blue-800 border-blue-200";
      case ErrorCategory.STORAGE:
        return "bg-amber-50 text-amber-800 border-amber-200";
      case ErrorCategory.AUTH:
      case ErrorCategory.AUTHENTICATION:
        return "bg-purple-50 text-purple-800 border-purple-200";
      case ErrorCategory.CRITICAL:
        return "bg-red-50 text-red-800 border-red-200";
      case ErrorCategory.VALIDATION:
        return "bg-orange-50 text-orange-800 border-orange-200";
      case ErrorCategory.SERVER:
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case ErrorCategory.TIMEOUT:
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case ErrorCategory.UNKNOWN:
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  if (variant === "secondary") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
        {category || "Unknown"}
      </span>
    );
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getColorByCategory()}`}>
      {category || "Unknown"}
    </span>
  );
}

// Returns troubleshooting steps based on error category
function getStepsForErrorCategory(
  category: ErrorCategory,
  error: Error | unknown,
  context: string
): Record<string, TroubleshootingStep> {
  // Common terminal steps
  const commonSteps = {
    'success': {
      id: 'success',
      title: 'Issue Resolved',
      description: 'The problem has been successfully resolved.',
      content: (
        <div className="space-y-4">
          <p>The issue has been successfully resolved and you can continue using the application.</p>
        </div>
      ),
      isTerminal: true
    },
    'failure': {
      id: 'failure',
      title: 'Unable to Resolve Issue',
      description: 'We could not automatically resolve the issue.',
      content: (
        <div className="space-y-4">
          <p>
            Unfortunately, we were unable to automatically resolve the issue. You may want to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Refresh the page and try again</li>
            <li>Clear your browser cache</li>
            <li>Contact support for assistance</li>
          </ul>
          <p>
            Error details: <span className="font-mono text-sm">{error instanceof Error ? error.message : String(error)}</span>
          </p>
        </div>
      ),
      isTerminal: true
    }
  };
  
  // Network error steps
  if (category === ErrorCategory.NETWORK) {
    return {
      'start': {
        id: 'start',
        title: 'Network Connection Issue',
        description: 'Let\'s troubleshoot your network connection.',
        content: (
          <div className="space-y-4">
            <p>We've detected a network connectivity issue. This could be due to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your internet connection is offline or unstable</li>
              <li>Server connectivity issues</li>
              <li>A problem with your browser's network settings</li>
            </ul>
          </div>
        ),
        options: [
          {
            id: 'check-connection',
            label: 'Check my internet connection',
            nextStep: 'connection-check',
            action: async () => {
              // No actual implementation needed for this demo
              await new Promise(resolve => setTimeout(resolve, 1500));
            }
          },
          {
            id: 'try-offline',
            label: 'Continue in offline mode',
            nextStep: 'offline-mode',
          }
        ]
      },
      'connection-check': {
        id: 'connection-check',
        title: 'Checking Connection',
        description: 'Verifying your network connection...',
        autoAction: async () => {
          // Simulate network check
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          try {
            const online = navigator.onLine;
            
            if (online) {
              // Try to fetch something to verify actual connectivity
              await fetch('https://www.google.com', { mode: 'no-cors', cache: 'no-store' });
              return { 
                success: true, 
                message: 'Your internet connection appears to be working.',
                nextStep: 'retry-operation'
              };
            } else {
              return {
                success: false,
                message: 'Your device appears to be offline.',
                nextStep: 'offline-mode'
              };
            }
          } catch (error) {
            return {
              success: false,
              message: 'Connection test failed. Your internet may be restricted.',
              nextStep: 'offline-mode'
            };
          }
        },
        content: (
          <div className="flex justify-center py-4">
            <div className="animate-pulse flex flex-col items-center">
              <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
              <p>Testing your network connection...</p>
            </div>
          </div>
        )
      },
      'retry-operation': {
        id: 'retry-operation',
        title: 'Connection Looks Good',
        description: 'Your internet connection appears to be working.',
        content: (
          <div className="space-y-4">
            <p>Your internet connection is working. The issue may have been temporary.</p>
            <p>Would you like to retry the operation that failed?</p>
          </div>
        ),
        options: [
          {
            id: 'retry',
            label: 'Retry operation',
            nextStep: 'success',
            action: async () => {
              // This would normally retry the original operation
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          },
          {
            id: 'cancel',
            label: 'Cancel and continue without retrying',
            nextStep: 'cancel'
          }
        ]
      },
      'offline-mode': {
        id: 'offline-mode',
        title: 'Offline Mode',
        description: 'Continue working with limited functionality.',
        content: (
          <div className="space-y-4">
            <Alert>
              <HelpCircle className="h-4 w-4" />
              <AlertTitle>Limited Functionality</AlertTitle>
              <AlertDescription>
                While offline, you can continue working with some limitations.
                Your changes will be saved locally and synchronized when your connection is restored.
              </AlertDescription>
            </Alert>
            <p>
              The application will continue in offline mode. 
              Some features may be unavailable until your connection is restored.
            </p>
          </div>
        ),
        options: [
          {
            id: 'continue-offline',
            label: 'Continue in offline mode',
            nextStep: 'success',
            action: async () => {
              // This would enable offline mode settings
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          },
          {
            id: 'retry-connection',
            label: 'Try checking my connection again',
            nextStep: 'connection-check'
          }
        ]
      },
      'cancel': {
        id: 'cancel',
        title: 'Operation Cancelled',
        description: 'The operation has been cancelled.',
        content: (
          <div className="space-y-4">
            <p>
              The operation has been cancelled. You can try again later.
            </p>
          </div>
        ),
        isTerminal: true
      },
      ...commonSteps
    };
  }
  
  // Auth error steps
  if (category === ErrorCategory.AUTH || category === ErrorCategory.AUTHENTICATION) {
    return {
      'start': {
        id: 'start',
        title: 'Authentication Issue',
        description: 'Let\'s troubleshoot your authentication problem.',
        content: (
          <div className="space-y-4">
            <p>We've detected an authentication issue. This could be due to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your session has expired</li>
              <li>You've been logged out</li>
              <li>There's an issue with the authentication service</li>
            </ul>
          </div>
        ),
        options: [
          {
            id: 'refresh-session',
            label: 'Refresh my session',
            nextStep: 'session-refresh',
            action: async () => {
              // This would normally call the session recovery service
              await new Promise(resolve => setTimeout(resolve, 1500));
            }
          },
          {
            id: 'relogin',
            label: 'Log in again',
            nextStep: 'relogin'
          }
        ]
      },
      'session-refresh': {
        id: 'session-refresh',
        title: 'Refreshing Session',
        description: 'Attempting to restore your session...',
        autoAction: async () => {
          // Simulate session refresh
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // In a real implementation, this would call sessionRecoveryService.recoverSession()
          // For demo purposes, we'll return success
          return { 
            success: true, 
            message: 'Your session has been refreshed successfully.',
            nextStep: 'success'
          };
        },
        content: (
          <div className="flex justify-center py-4">
            <div className="animate-pulse flex flex-col items-center">
              <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
              <p>Refreshing your session...</p>
            </div>
          </div>
        )
      },
      'relogin': {
        id: 'relogin',
        title: 'Re-authentication Required',
        description: 'You need to log in again to continue.',
        content: (
          <div className="space-y-4">
            <p>
              Your session cannot be automatically refreshed. You will need to log in again 
              to continue using the application.
            </p>
            <p>
              Don't worry - any unsaved changes have been backed up and will be available 
              after you log in again.
            </p>
          </div>
        ),
        options: [
          {
            id: 'login',
            label: 'Go to login page',
            nextStep: 'redirect-login',
            action: async () => {
              // This would normally redirect to login page
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          },
          {
            id: 'cancel',
            label: 'Cancel (stay on current page)',
            nextStep: 'cancel'
          }
        ]
      },
      'redirect-login': {
        id: 'redirect-login',
        title: 'Redirecting to Login',
        description: 'Taking you to the login page...',
        content: (
          <div className="flex justify-center py-4">
            <div className="animate-pulse flex flex-col items-center">
              <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
              <p>Redirecting to login page...</p>
            </div>
          </div>
        ),
        autoAction: async () => {
          // In a real implementation, this would redirect to the login page
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Demo implementation: show dialog completion instead of actual redirect
          return { 
            success: true,
            nextStep: 'success'
          };
        }
      },
      ...commonSteps
    };
  }
  
  // Storage error steps
  if (category === ErrorCategory.STORAGE) {
    return {
      'start': {
        id: 'start',
        title: 'Storage Issue Detected',
        description: 'Let\'s troubleshoot storage access problems.',
        content: (
          <div className="space-y-4">
            <p>We've detected a storage issue. This could be due to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Browser storage quota exceeded</li>
              <li>Storage access denied by your browser</li>
              <li>Corrupted local data</li>
            </ul>
          </div>
        ),
        options: [
          {
            id: 'check-storage',
            label: 'Check storage status',
            nextStep: 'storage-check',
            action: async () => {
              await new Promise(resolve => setTimeout(resolve, 1500));
            }
          },
          {
            id: 'clear-storage',
            label: 'Clear problematic storage data',
            nextStep: 'clear-confirm'
          }
        ]
      },
      'storage-check': {
        id: 'storage-check',
        title: 'Checking Storage',
        description: 'Analyzing storage issues...',
        autoAction: async () => {
          // Simulate storage analysis
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          try {
            // In a real implementation, this would check storage usage and quotas
            // For demo purposes, assume storage access is granted but high usage
            return { 
              success: true, 
              message: 'Storage access is available but usage is high.',
              nextStep: 'storage-management'
            };
          } catch (error) {
            return {
              success: false,
              message: 'Storage access is blocked by your browser settings.',
              nextStep: 'storage-help'
            };
          }
        },
        content: (
          <div className="flex justify-center py-4">
            <div className="animate-pulse flex flex-col items-center">
              <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
              <p>Analyzing storage status...</p>
            </div>
          </div>
        )
      },
      'storage-management': {
        id: 'storage-management',
        title: 'Storage Management',
        description: 'Manage your local storage to free up space.',
        content: (
          <div className="space-y-4">
            <p>
              Your browser storage is getting full. This can affect the application's ability
              to save your work locally.
            </p>
            <p>
              Would you like to clean up your storage to free up space?
            </p>
          </div>
        ),
        options: [
          {
            id: 'cleanup',
            label: 'Clean up old data (recommended)',
            nextStep: 'storage-cleanup',
            action: async () => {
              // This would normally clean up old storage data
              await new Promise(resolve => setTimeout(resolve, 1500));
            }
          },
          {
            id: 'skip',
            label: 'Skip and continue with limited storage',
            nextStep: 'limited-storage'
          }
        ]
      },
      'storage-cleanup': {
        id: 'storage-cleanup',
        title: 'Storage Cleanup',
        description: 'Removing old data to free up space...',
        content: (
          <div className="flex justify-center py-4">
            <div className="animate-pulse flex flex-col items-center">
              <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
              <p>Cleaning up storage...</p>
            </div>
          </div>
        ),
        autoAction: async () => {
          // Simulate storage cleanup
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // In a real implementation, this would clean up old backups and unused data
          return { 
            success: true, 
            message: 'Storage cleanup completed successfully.',
            nextStep: 'success'
          };
        }
      },
      'clear-confirm': {
        id: 'clear-confirm',
        title: 'Confirm Data Clearing',
        description: 'Warning: This will delete locally stored data.',
        content: (
          <Alert variant="destructive">
            <AlertTitle>Warning: Data Loss Risk</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                This action will delete locally stored data, which may include:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Document backups</li>
                <li>Unsaved drafts</li>
                <li>Application settings</li>
              </ul>
              <p className="mt-2">
                Any data that hasn't been saved to the server will be lost.
              </p>
            </AlertDescription>
          </Alert>
        ),
        options: [
          {
            id: 'confirm-clear',
            label: 'Yes, clear my data (cannot be undone)',
            nextStep: 'clearing-data',
            action: async () => {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          },
          {
            id: 'cancel-clear',
            label: 'No, keep my data',
            nextStep: 'storage-management'
          }
        ]
      },
      'clearing-data': {
        id: 'clearing-data',
        title: 'Clearing Local Data',
        description: 'Removing problematic data...',
        content: (
          <div className="flex justify-center py-4">
            <div className="animate-pulse flex flex-col items-center">
              <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
              <p>Clearing local data...</p>
            </div>
          </div>
        ),
        autoAction: async () => {
          // Simulate data clearing
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // In a real implementation, this would clear localStorage, indexedDB, etc.
          return { 
            success: true, 
            message: 'Local data has been cleared successfully.',
            nextStep: 'restart-app'
          };
        }
      },
      'restart-app': {
        id: 'restart-app',
        title: 'Restart Required',
        description: 'The application needs to restart to apply changes.',
        content: (
          <div className="space-y-4">
            <p>
              Your local data has been cleared successfully. The application needs to reload
              to apply these changes.
            </p>
            <p>
              The page will refresh automatically when you click "Restart Now".
            </p>
          </div>
        ),
        options: [
          {
            id: 'restart',
            label: 'Restart Now',
            nextStep: 'success',
            action: async () => {
              // This would normally reload the page
              await new Promise(resolve => setTimeout(resolve, 1000));
              // window.location.reload();
            }
          }
        ]
      },
      'limited-storage': {
        id: 'limited-storage',
        title: 'Limited Storage Mode',
        description: 'Continue with limited local storage.',
        content: (
          <div className="space-y-4">
            <Alert>
              <HelpCircle className="h-4 w-4" />
              <AlertTitle>Limited Functionality</AlertTitle>
              <AlertDescription>
                In limited storage mode, some features may not work correctly:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Automatic backups will be limited</li>
                  <li>Offline editing may be restricted</li>
                  <li>Document history may be reduced</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        ),
        options: [
          {
            id: 'continue-limited',
            label: 'Continue with limited storage',
            nextStep: 'success',
            action: async () => {
              // This would configure the app for limited storage mode
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          },
          {
            id: 'reconsider',
            label: 'On second thought, let me free up space',
            nextStep: 'storage-cleanup'
          }
        ]
      },
      'storage-help': {
        id: 'storage-help',
        title: 'Storage Access Blocked',
        description: 'Your browser is blocking storage access.',
        content: (
          <div className="space-y-4">
            <p>
              The application cannot access local storage due to browser restrictions.
              This could be due to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Private/Incognito browsing mode</li>
              <li>Browser settings blocking storage</li>
              <li>Browser extensions interfering with storage</li>
            </ul>
            <p className="mt-2">
              To resolve this issue, try:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Disable private browsing mode</li>
              <li>Allow cookies and storage for this site</li>
              <li>Temporarily disable browser extensions</li>
            </ul>
          </div>
        ),
        options: [
          {
            id: 'retry-storage',
            label: 'I\'ve updated my settings, try again',
            nextStep: 'storage-check',
            action: async () => {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          },
          {
            id: 'continue-no-storage',
            label: 'Continue without local storage',
            nextStep: 'limited-storage'
          }
        ]
      },
      ...commonSteps
    };
  }
  
  // Generic error fallback
  return {
    'start': {
      id: 'start',
      title: 'Troubleshoot Error',
      description: 'Let\'s resolve the issue you\'re experiencing.',
      content: (
        <div className="space-y-4">
          <p>We've detected an error. Let's try to resolve it:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>First, we'll check if a simple refresh can fix the issue</li>
            <li>If not, we'll try more advanced recovery options</li>
          </ul>
        </div>
      ),
      options: [
        {
          id: 'try-refresh',
          label: 'Try refreshing the application state',
          nextStep: 'refreshing',
          action: async () => {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        },
        {
          id: 'advanced',
          label: 'Go to advanced troubleshooting',
          nextStep: 'advanced'
        }
      ]
    },
    'refreshing': {
      id: 'refreshing',
      title: 'Refreshing State',
      description: 'Attempting to refresh application state...',
      content: (
        <div className="flex justify-center py-4">
          <div className="animate-pulse flex flex-col items-center">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p>Refreshing application state...</p>
          </div>
        </div>
      ),
      autoAction: async () => {
        // Simulate refresh
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For demo purposes, assume 50% success rate
        const success = Math.random() > 0.5;
        
        return { 
          success, 
          message: success 
            ? 'Application state refreshed successfully.' 
            : 'Could not fully refresh application state.',
          nextStep: success ? 'success' : 'advanced'
        };
      }
    },
    'advanced': {
      id: 'advanced',
      title: 'Advanced Troubleshooting',
      description: 'Let\'s try more advanced solutions.',
      content: (
        <div className="space-y-4">
          <p>
            Let's try more advanced troubleshooting options:
          </p>
        </div>
      ),
      options: [
        {
          id: 'clear-cache',
          label: 'Clear application cache',
          nextStep: 'clearing-cache',
          action: async () => {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        },
        {
          id: 'reset-state',
          label: 'Reset application to default state',
          nextStep: 'reset-confirm'
        }
      ]
    },
    'clearing-cache': {
      id: 'clearing-cache',
      title: 'Clearing Cache',
      description: 'Removing cached data...',
      content: (
        <div className="flex justify-center py-4">
          <div className="animate-pulse flex flex-col items-center">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p>Clearing application cache...</p>
          </div>
        </div>
      ),
      autoAction: async () => {
        // Simulate cache clearing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For demo purposes, assume success
        return { 
          success: true, 
          message: 'Application cache cleared successfully.',
          nextStep: 'restart-app'
        };
      }
    },
    'reset-confirm': {
      id: 'reset-confirm',
      title: 'Confirm Reset',
      description: 'Warning: This will reset all application settings.',
      content: (
        <Alert variant="destructive">
          <AlertTitle>Warning: Reset Confirmation</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              This will reset the application to its default state, which includes:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Clearing all user preferences</li>
              <li>Resetting layout customizations</li>
              <li>Clearing local caches</li>
            </ul>
            <p className="mt-2">
              Your documents and account data will not be affected.
            </p>
          </AlertDescription>
        </Alert>
      ),
      options: [
        {
          id: 'confirm-reset',
          label: 'Yes, reset to default state',
          nextStep: 'resetting',
          action: async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        },
        {
          id: 'cancel-reset',
          label: 'No, try something else',
          nextStep: 'advanced'
        }
      ]
    },
    'resetting': {
      id: 'resetting',
      title: 'Resetting Application',
      description: 'Restoring default settings...',
      content: (
        <div className="flex justify-center py-4">
          <div className="animate-pulse flex flex-col items-center">
            <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
            <p>Resetting to default state...</p>
          </div>
        </div>
      ),
      autoAction: async () => {
        // Simulate reset
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        return { 
          success: true, 
          message: 'Application has been reset successfully.',
          nextStep: 'restart-app'
        };
      }
    },
    'restart-app': {
      id: 'restart-app',
      title: 'Restart Required',
      description: 'The application needs to restart to apply changes.',
      content: (
        <div className="space-y-4">
          <p>
            The changes have been applied successfully. The application needs to reload
            to complete the process.
          </p>
          <p>
            The page will refresh automatically when you click "Restart Now".
          </p>
        </div>
      ),
      options: [
        {
          id: 'restart',
          label: 'Restart Now',
          nextStep: 'success',
          action: async () => {
            // This would normally reload the page
            await new Promise(resolve => setTimeout(resolve, 1000));
            // window.location.reload();
          }
        }
      ]
    },
    ...commonSteps
  };
}
