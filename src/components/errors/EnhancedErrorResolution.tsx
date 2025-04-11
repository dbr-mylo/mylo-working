
import React, { useState } from 'react';
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

interface EnhancedErrorResolutionProps {
  error: Error | unknown;
  context: string;
  feature?: string;
  onRetry?: () => void;
  onClose?: () => void;
}

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
  const { flags, isEnabled } = useFeatureFlags();
  const { role } = useAuth();
  const { handleAuthError, isRecovering } = useSessionRecovery();
  
  // Classify the error
  const classifiedError = classifyError(error, context);
  const isAuthError = classifiedError.category === ErrorCategory.AUTH;
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Check if automated troubleshooting is available based on error type
  const hasAutomatedTroubleshooting = isEnabled('auto_recovery') && (
    classifiedError.category === ErrorCategory.NETWORK ||
    classifiedError.category === ErrorCategory.STORAGE ||
    classifiedError.category === ErrorCategory.AUTH ||
    classifiedError.category === ErrorCategory.SERVER
  );
  
  // Function to attempt automated recovery based on error type
  const attemptAutomatedRecovery = async () => {
    setIsAutoRecovering(true);
    
    try {
      // For auth errors, use session recovery service
      if (isAuthError) {
        const result = await handleAuthError(error, context);
        
        if (result.recovered && onRetry) {
          onRetry();
          if (onClose) onClose();
          return;
        }
      }
      
      // For other error types, implement specific recovery logic
      // This is just a placeholder - actual implementation would depend on error type
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // If recovery was successful, retry the operation
      if (Math.random() > 0.3) { // Simulate 70% success rate
        if (onRetry) {
          onRetry();
          if (onClose) onClose();
        }
      }
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
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Attempt Automatic Recovery
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
                  </>
                )}
              </div>
              
              <RecoveryOptions 
                error={error instanceof Error ? error : null}
                context={context}
                feature={feature}
                onRetry={onRetry}
              />
            </div>
          </TabsContent>
          
          {hasAutomatedTroubleshooting && (
            <TabsContent value="troubleshooter" className="p-0">
              <InteractiveTroubleshooter
                error={error}
                context={context}
                onResolve={onRetry}
                onGiveUp={onClose}
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
                  </div>
                </div>
              </div>
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
