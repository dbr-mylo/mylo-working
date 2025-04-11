
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ChevronRight, ChevronLeft, CheckCircle, RefreshCw, AlertTriangle, XCircle, Info } from "lucide-react";
import { classifyError, ErrorCategory } from "@/utils/error/errorClassifier";
import { runDiagnostics } from "@/utils/error/diagnostics";
import { NetworkStatusIndicator } from "@/components/status/NetworkStatusIndicator";

interface GuidedResolutionProps {
  error: unknown;
  context: string;
  feature?: string;
  onResolve?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function GuidedResolution({
  error,
  context,
  feature,
  onResolve,
  onCancel,
  className = "",
}: GuidedResolutionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isResolved, setIsResolved] = useState(false);
  const [diagResults, setDiagResults] = useState<{ [key: string]: any } | null>(null);
  
  // Classify error to determine resolution flow
  const classifiedError = classifyError(error, context);
  
  // Generate steps based on error category
  const resolutionSteps = getResolutionSteps(classifiedError.category, feature);
  const totalSteps = resolutionSteps.length;
  
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsResolved(true);
      if (onResolve) onResolve();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleCancel = () => {
    if (onCancel) onCancel();
  };
  
  const handleRunDiagnostics = () => {
    runDiagnostics();
    setDiagResults({
      browser: navigator.userAgent,
      online: navigator.onLine,
      storageAvailable: checkLocalStorageAvailability(),
      timestamp: new Date().toISOString()
    });
  };
  
  // Show completion screen if resolved
  if (isResolved) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-green-600 flex items-center">
            <CheckCircle className="mr-2 h-5 w-5" />
            Resolution Complete
          </CardTitle>
          <CardDescription>
            The issue has been resolved. You can now continue working.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            If you encounter this issue again, please contact support with the error details.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={onResolve} className="w-full">
            Continue
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  const currentResolutionStep = resolutionSteps[currentStep];
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          {getErrorIcon(classifiedError.category)}
          <span className="ml-2">Error Resolution Guide</span>
        </CardTitle>
        <CardDescription>
          Follow these steps to resolve the issue
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Step indicator */}
        <div className="text-xs text-muted-foreground mb-2">
          Step {currentStep + 1} of {totalSteps}
        </div>
        
        {/* Current step content */}
        <div className="space-y-4">
          <h3 className="text-base font-medium">{currentResolutionStep.title}</h3>
          <p className="text-sm text-muted-foreground">
            {currentResolutionStep.description}
          </p>
          
          {/* Action component if any */}
          {currentResolutionStep.actionComponent === 'diagnostics' && (
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRunDiagnostics}
              >
                <RefreshCw className="mr-2 h-3 w-3" />
                Run Diagnostics
              </Button>
              
              {diagResults && (
                <div className="mt-2 p-2 bg-muted text-xs rounded">
                  <div className="mb-1">Browser: {diagResults.browser}</div>
                  <div className="mb-1">Status: {diagResults.online ? 'Online' : 'Offline'}</div>
                  <div className="mb-1">Storage: {diagResults.storageAvailable ? 'Available' : 'Unavailable'}</div>
                  <div>Time: {new Date(diagResults.timestamp).toLocaleTimeString()}</div>
                </div>
              )}
            </div>
          )}
          
          {currentResolutionStep.actionComponent === 'networkCheck' && (
            <div className="flex items-center space-x-2">
              <NetworkStatusIndicator showLabel size="lg" variant="prominent" />
              {!navigator.onLine && (
                <Alert variant="warning" className="mt-2">
                  <AlertTitle>You're offline</AlertTitle>
                  <AlertDescription>
                    This feature requires an internet connection.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          {/* Tips */}
          {currentResolutionStep.tips && (
            <Alert variant="default" className="bg-muted/50">
              <Info className="h-4 w-4" />
              <AlertTitle>Tip</AlertTitle>
              <AlertDescription className="text-xs">
                {currentResolutionStep.tips}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={currentStep === 0 ? handleCancel : handlePrevious}
        >
          {currentStep === 0 ? 'Cancel' : (
            <>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </>
          )}
        </Button>
        
        <Button onClick={handleNext}>
          {currentStep < totalSteps - 1 ? (
            <>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          ) : (
            'Complete'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Helper function to generate resolution steps based on error category
function getResolutionSteps(errorCategory: ErrorCategory, feature?: string) {
  const commonSteps = [
    {
      title: "Check your connection",
      description: "First, let's verify that your device is connected to the internet.",
      actionComponent: 'networkCheck',
      tips: "You can try opening another website to verify your connection."
    },
    {
      title: "Run diagnostics",
      description: "Let's run a quick system check to identify any issues.",
      actionComponent: 'diagnostics',
      tips: "This will check your browser compatibility and local storage access."
    }
  ];
  
  // Network specific steps
  if (errorCategory === ErrorCategory.NETWORK) {
    return [
      ...commonSteps,
      {
        title: "Reconnect to continue",
        description: "The application requires an internet connection for this action. Please reconnect to continue.",
        tips: "Your work is being saved locally and will sync when you're back online."
      }
    ];
  }
  
  // Permission specific steps
  if (errorCategory === ErrorCategory.PERMISSION) {
    return [
      {
        title: "Authentication required",
        description: "You don't have permission to access this resource.",
        tips: "Try signing in with an account that has the required permissions."
      },
      ...commonSteps
    ];
  }
  
  // Document editor specific steps
  if (feature === 'editor' || feature === 'document') {
    return [
      {
        title: "Check document status",
        description: "The document might be locked or being edited by another user.",
        tips: "Try reopening the document or making a copy."
      },
      ...commonSteps
    ];
  }
  
  // Return general steps for other cases
  return [
    ...commonSteps,
    {
      title: "Clear application cache",
      description: "Clearing your browser cache may resolve this issue.",
      tips: "This will not delete your documents but may reset some preferences."
    }
  ];
}

// Helper function to check localStorage availability
function checkLocalStorageAvailability(): boolean {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    return false;
  }
}

// Helper function to get appropriate icon for error category
function getErrorIcon(category: ErrorCategory) {
  switch (category) {
    case ErrorCategory.NETWORK:
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case ErrorCategory.PERMISSION:
      return <XCircle className="h-5 w-5 text-red-500" />;
    case ErrorCategory.SERVER:
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
}
