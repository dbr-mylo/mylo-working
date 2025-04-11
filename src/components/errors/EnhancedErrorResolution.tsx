
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, RefreshCw, Info } from 'lucide-react';
import { RecoveryOptions } from './RecoveryOptions';
import { InteractiveTroubleshooter } from './InteractiveTroubleshooter';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ErrorCategory, classifyError } from '@/utils/error/errorClassifier';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useSessionRecovery } from '@/hooks/useSessionRecovery';
import { useAuth } from '@/contexts/AuthContext';
import { trackErrorOccurrence, trackRecoveryAttempt, isLikelyRecoverable } from '@/utils/error/selfHealingSystem';
import { getLocalStorage, setLocalStorage } from '@/utils/storage/localStorage';

interface EnhancedErrorResolutionProps {
  error: Error | unknown;
  context: string;
  feature?: string;
  onRetry?: () => void;
  onClose?: () => void;
}

// Key for storing troubleshooting sessions in localStorage
const TROUBLESHOOTING_SESSION_KEY = 'error_troubleshooting_sessions';

/**
 * Enhanced error resolution component with troubleshooter wizard and recovery options
 */
export function EnhancedErrorResolution({
  error,
  context,
  feature,
  onRetry,
  onClose
}: EnhancedErrorResolutionProps) {
  const [activeTab, setActiveTab] = useState<string>("quick-fix");
  const [isAutoRecovering, setIsAutoRecovering] = useState(false);
  const [hasSavedSession, setHasSavedSession] = useState(false);
  const { flags, isEnabled } = useFeatureFlags();
  const { role } = useAuth();
  const { handleAuthError, isRecovering, metrics } = useSessionRecovery();
  
  // Classify the error
  const classifiedError = classifyError(error, context);
  const isAuthError = classifiedError.category === ErrorCategory.AUTH || 
                      classifiedError.category === ErrorCategory.AUTHENTICATION;
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Check if the error is likely recoverable
  const errorLikelyRecoverable = isLikelyRecoverable(classifiedError.category);
  
  // Check if automated troubleshooting is available based on error type
  const hasAutomatedTroubleshooting = isEnabled('auto_recovery') && (
    classifiedError.category === ErrorCategory.NETWORK ||
    classifiedError.category === ErrorCategory.STORAGE ||
    classifiedError.category === ErrorCategory.AUTH ||
    classifiedError.category === ErrorCategory.AUTHENTICATION ||
    classifiedError.category === ErrorCategory.SERVER
  );
  
  // Track the error
  useEffect(() => {
    // Track the error occurrence
    trackErrorOccurrence(
      classifiedError.category,
      errorMessage,
      context,
      false, // Will set to true if recovery is attempted
      false, // Will set to true if recovery succeeds
      error instanceof Error ? error.stack : undefined
    );
    
    // Check for a saved session
    const savedSessions = getLocalStorage<Record<string, any>>(TROUBLESHOOTING_SESSION_KEY) || {};
    const sessionKey = `${classifiedError.category}-${context}`;
    
    if (savedSessions[sessionKey]) {
      setHasSavedSession(true);
    }
  }, [classifiedError.category, context, error, errorMessage]);
  
  // Function to attempt automated recovery based on error type
  const attemptAutomatedRecovery = async () => {
    setIsAutoRecovering(true);
    
    try {
      let recoverySucceeded = false;
      
      // For auth errors, use session recovery service
      if (isAuthError) {
        const result = await handleAuthError(error, context);
        recoverySucceeded = result.recovered;
        
        if (result.recovered && onRetry) {
          onRetry();
          if (onClose) onClose();
          return;
        }
      } else if (classifiedError.category === ErrorCategory.NETWORK) {
        // Network error recovery
        // Try a simple fetch to check if network is available
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
          recoverySucceeded = response.ok;
          
          if (recoverySucceeded && onRetry) {
            onRetry();
            if (onClose) onClose();
            return;
          }
        } catch (e) {
          recoverySucceeded = false;
        }
      } else if (classifiedError.category === ErrorCategory.STORAGE) {
        // Storage error recovery
        // Check if storage is accessible
        try {
          const testKey = '___test_storage___';
          localStorage.setItem(testKey, 'test');
          const value = localStorage.getItem(testKey);
          localStorage.removeItem(testKey);
          recoverySucceeded = value === 'test';
          
          if (recoverySucceeded && onRetry) {
            onRetry();
            if (onClose) onClose();
            return;
          }
        } catch (e) {
          recoverySucceeded = false;
        }
      }
      
      // Track the recovery attempt
      trackRecoveryAttempt(classifiedError.category, context, recoverySucceeded);
      
      // If specific recoveries didn't work, try a general retry
      if (!recoverySucceeded && onRetry) {
        onRetry();
      }
    } catch (e) {
      console.error('Error during auto-recovery:', e);
      trackRecoveryAttempt(classifiedError.category, context, false);
    } finally {
      setIsAutoRecovering(false);
    }
  };
  
  // Generate human-readable title for the error
  const getErrorTitle = () => {
    switch (classifiedError.category) {
      case ErrorCategory.NETWORK:
        return "Network Connection Error";
      case ErrorCategory.STORAGE:
        return "Storage Access Error";
      case ErrorCategory.AUTH:
      case ErrorCategory.AUTHENTICATION:
        return "Authentication Error";
      case ErrorCategory.SERVER:
        return "Server Error";
      case ErrorCategory.VALIDATION:
        return "Validation Error";
      case ErrorCategory.TIMEOUT:
        return "Request Timeout";
      case ErrorCategory.CRITICAL:
        return "Critical System Error";
      case ErrorCategory.UNKNOWN:
      default:
        return "Application Error";
    }
  };
  
  // Function to save the current troubleshooting state
  const saveTroubleshootingState = () => {
    try {
      const savedSessions = getLocalStorage<Record<string, any>>(TROUBLESHOOTING_SESSION_KEY) || {};
      const sessionKey = `${classifiedError.category}-${context}`;
      
      savedSessions[sessionKey] = {
        timestamp: Date.now(),
        errorCategory: classifiedError.category,
        errorMessage: errorMessage,
        context: context,
        feature: feature
      };
      
      setLocalStorage(TROUBLESHOOTING_SESSION_KEY, savedSessions);
      setHasSavedSession(true);
    } catch (e) {
      console.error('Failed to save troubleshooting state:', e);
    }
  };
  
  // Function to remove saved troubleshooting session
  const clearTroubleshootingState = () => {
    try {
      const savedSessions = getLocalStorage<Record<string, any>>(TROUBLESHOOTING_SESSION_KEY) || {};
      const sessionKey = `${classifiedError.category}-${context}`;
      
      if (savedSessions[sessionKey]) {
        delete savedSessions[sessionKey];
        setLocalStorage(TROUBLESHOOTING_SESSION_KEY, savedSessions);
      }
      
      setHasSavedSession(false);
    } catch (e) {
      console.error('Failed to clear troubleshooting state:', e);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border shadow-lg">
      <CardHeader className="bg-muted/30">
        <div className="flex items-start gap-3">
          <AlertCircle className={`h-5 w-5 ${
            classifiedError.category === ErrorCategory.CRITICAL ? "text-destructive" : "text-amber-500"
          }`} />
          <div>
            <CardTitle>{getErrorTitle()}</CardTitle>
            <CardDescription className="mt-1">{errorMessage}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 border-b">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="quick-fix">Quick Fix</TabsTrigger>
            {hasAutomatedTroubleshooting && (
              <TabsTrigger value="troubleshooter">Troubleshooter</TabsTrigger>
            )}
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="p-0">
          <TabsContent value="quick-fix" className="p-4 space-y-4">
            {isAuthError && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Session Issue Detected</AlertTitle>
                <AlertDescription>
                  Your session may have expired or has authentication problems.
                </AlertDescription>
              </Alert>
            )}
            
            {hasSavedSession && (
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle>Saved Troubleshooting Session</AlertTitle>
                <AlertDescription className="flex justify-between items-center">
                  <span>You have a saved troubleshooting session for this error.</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-blue-100 border-blue-200 hover:bg-blue-200 text-blue-800"
                    onClick={() => {
                      setActiveTab('troubleshooter');
                    }}
                  >
                    Resume
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <h3 className="font-medium">Recommended Actions</h3>
              
              <div className="flex flex-col gap-2">
                {isAutoRecovering || isRecovering ? (
                  <div className="flex items-center py-2 px-3 bg-muted/30 rounded-md">
                    <RefreshCw className="animate-spin h-4 w-4 mr-2 text-primary" />
                    <span>Attempting automatic recovery...</span>
                  </div>
                ) : (
                  <>
                    {hasAutomatedTroubleshooting && (
                      <Button 
                        variant="default" 
                        onClick={attemptAutomatedRecovery}
                        className="justify-start"
                        disabled={!errorLikelyRecoverable}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Attempt Automatic Recovery
                        {!errorLikelyRecoverable && " (Low Success Probability)"}
                      </Button>
                    )}
                    
                    {onRetry && (
                      <Button 
                        variant={hasAutomatedTroubleshooting ? "outline" : "default"} 
                        onClick={onRetry}
                        className="justify-start"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry Operation
                      </Button>
                    )}
                    
                    {hasAutomatedTroubleshooting && (
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          setActiveTab('troubleshooter');
                          saveTroubleshootingState();
                        }}
                        className="justify-start"
                      >
                        <Info className="h-4 w-4 mr-2" />
                        Use Guided Troubleshooter
                      </Button>
                    )}
                  </>
                )}
              </div>
              
              <RecoveryOptions 
                error={error instanceof Error ? error : null}
                context={context}
                feature={feature}
                onRetry={onRetry}
                specialized={true}
              />
            </div>
          </TabsContent>
          
          {hasAutomatedTroubleshooting && (
            <TabsContent value="troubleshooter" className="p-0">
              <InteractiveTroubleshooter
                error={error}
                context={context}
                onResolve={() => {
                  clearTroubleshootingState();
                  onRetry?.();
                }}
                onGiveUp={() => {
                  setActiveTab('quick-fix');
                }}
              />
            </TabsContent>
          )}
          
          <TabsContent value="details" className="p-4 space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Error Details</h3>
                <div className="mt-2 p-3 bg-muted rounded-md overflow-auto">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                    {error instanceof Error ? (
                      <>
                        <span className="font-semibold">{error.name}</span>: {error.message}
                        {error.stack && (
                          <div className="mt-2 text-xs opacity-80">
                            {error.stack.split('\n').slice(1).join('\n')}
                          </div>
                        )}
                      </>
                    ) : (
                      String(error)
                    )}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium">Context Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <div className="text-muted-foreground">Error Category:</div>
                    <div>{classifiedError.category}</div>
                    
                    <div className="text-muted-foreground">Error Context:</div>
                    <div>{context}</div>
                    
                    <div className="text-muted-foreground">Feature:</div>
                    <div>{feature || 'Not specified'}</div>
                    
                    <div className="text-muted-foreground">User Role:</div>
                    <div>{role || 'Not authenticated'}</div>
                    
                    <div className="text-muted-foreground">Recovery Success Rate:</div>
                    <div>
                      {metrics && (metrics.successfulAttempts / (metrics.totalAttempts || 1) * 100).toFixed(0)}% 
                      ({metrics?.successfulAttempts || 0}/{metrics?.totalAttempts || 0})
                    </div>
                  </div>
                </div>
              </div>
              
              {errorLikelyRecoverable && hasAutomatedTroubleshooting && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <Info className="h-4 w-4 text-green-600" />
                  <AlertTitle>Automatic Recovery Available</AlertTitle>
                  <AlertDescription>
                    This error type has been successfully recovered automatically in the past.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-end border-t p-4">
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
