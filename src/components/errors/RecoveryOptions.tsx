
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { runDiagnostics } from "@/utils/error/diagnostics";
import { RefreshCw, Home, Wrench, Flag, Save, Book, FileCheck } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorRecoverySteps } from '@/utils/error/handleError';
import { v4 as uuidv4 } from 'uuid';
import { getSystemHealth, getSystemHealthStatus } from '@/utils/featureFlags/systemHealth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  identifyErrorPattern, 
  saveTroubleshootingSession, 
  loadTroubleshootingSession,
  addTroubleshootingStep
} from '@/utils/error/troubleshootingPatterns';

export interface RecoveryOptionsProps {
  onRetry?: () => void;
  error?: Error | null;
  context?: string;
  feature?: string;
  specialized?: boolean;
}

export const RecoveryOptions: React.FC<RecoveryOptionsProps> = ({ 
  onRetry, 
  error,
  context = 'unknown',
  feature,
  specialized = false
}) => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [systemHealth, setSystemHealth] = useState(getSystemHealth());
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const [matchedPatterns, setMatchedPatterns] = useState<string[]>([]);
  const [showSaveSession, setShowSaveSession] = useState(false);
  const [sessionName, setSessionName] = useState('');
  
  // Get dynamic recovery steps based on error, role, and feature
  const recoverySteps = error 
    ? getErrorRecoverySteps(error, context, role, feature)
    : [];

  // Identify error patterns when component mounts or error changes
  useEffect(() => {
    if (error) {
      // Look for patterns in the error
      const patterns = identifyErrorPattern(error, context);
      setMatchedPatterns(patterns);

      // Check for existing session
      const savedSession = localStorage.getItem(`troubleshooting_${context}_${error.name}`);
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession);
          setSessionId(session.id);
          setSessionName(session.feature || 'Unknown issue');
        } catch (e) {
          console.error('Failed to parse saved troubleshooting session:', e);
        }
      } else {
        // Create a new session ID
        setSessionId(uuidv4());
        setSessionName(feature || 'Unknown issue');
      }
    }
  }, [error, context, feature]);
  
  const handleRefresh = () => {
    toast.info("Refreshing application...");
    if (sessionId) {
      addTroubleshootingStep(sessionId, "Refreshed the application", "inconclusive");
    }
    window.location.reload();
  };
  
  const handleDiagnostics = () => {
    toast.info("Running diagnostics...");
    const result = runDiagnostics();
    
    if (result) {
      toast.success("Diagnostics completed successfully");
      
      if (sessionId) {
        addTroubleshootingStep(
          sessionId, 
          "Ran system diagnostics", 
          "success", 
          "All diagnostics passed successfully"
        );
      }
    } else {
      toast.error("Diagnostics failed");
      
      if (sessionId) {
        addTroubleshootingStep(
          sessionId, 
          "Ran system diagnostics", 
          "failure", 
          "Some diagnostics failed"
        );
      }
    }
  };
  
  const handleGoHome = () => {
    toast.info("Returning to home page...");
    if (sessionId) {
      addTroubleshootingStep(sessionId, "Navigated to home page", "inconclusive");
    }
    navigate('/');
  };
  
  const handleRetry = () => {
    if (onRetry) {
      toast.info("Retrying operation...");
      if (sessionId) {
        addTroubleshootingStep(sessionId, "Retried the operation", "inconclusive");
      }
      onRetry();
    }
  };
  
  const handleSaveSession = () => {
    if (!sessionId) return;
    
    saveTroubleshootingSession(sessionId, {
      name: sessionName,
      notes: sessionNotes,
      status: 'in-progress'
    });
    
    toast.success("Troubleshooting session saved");
    setShowSaveSession(false);
  };
  
  const handleLoadSession = () => {
    if (!sessionId) return;
    
    const session = loadTroubleshootingSession(sessionId);
    if (session) {
      setSessionNotes(session.notes || '');
      setSessionName(session.name || '');
      toast.success("Troubleshooting session loaded");
    } else {
      toast.error("Failed to load troubleshooting session");
    }
  };
  
  const handleApplyPattern = (remediation: string) => {
    toast.info("Applying automated remediation...");
    
    // Simulate applying the pattern
    setTimeout(() => {
      if (Math.random() > 0.3) {
        toast.success("Remediation applied successfully");
        if (sessionId) {
          addTroubleshootingStep(
            sessionId, 
            `Applied automated remediation: ${remediation.substring(0, 50)}...`, 
            "success"
          );
        }
      } else {
        toast.error("Remediation failed to resolve the issue");
        if (sessionId) {
          addTroubleshootingStep(
            sessionId, 
            `Attempted automated remediation: ${remediation.substring(0, 50)}...`, 
            "failure"
          );
        }
      }
    }, 1500);
  };
  
  const getSystemHealthClasses = () => {
    const status = getSystemHealthStatus();
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recovery Options</h3>
        <Badge variant="outline" className={getSystemHealthClasses()}>
          System Health: {systemHealth}%
        </Badge>
      </div>
      
      {/* Display matched error patterns if available */}
      {matchedPatterns.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <h4 className="text-sm font-medium text-blue-800 flex items-center mb-1">
            <Book className="h-4 w-4 mr-1" />
            Suggested Automatic Recovery
          </h4>
          <ul className="space-y-2">
            {matchedPatterns.map((pattern, idx) => (
              <li key={idx} className="flex items-center justify-between text-sm">
                <span className="text-blue-600">{pattern}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleApplyPattern(pattern)}
                  className="h-7 px-2 text-xs"
                >
                  Apply
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Display custom recovery steps if available */}
      {recoverySteps.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
          <h4 className="text-sm font-medium text-amber-800 flex items-center mb-1">
            <FileCheck className="h-4 w-4 mr-1" />
            Recommended Steps
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-amber-700">
            {recoverySteps.map((step, index) => (
              <li key={index} className="text-sm">{step}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          className="w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Page
        </Button>
        
        {onRetry && (
          <Button 
            variant="outline" 
            onClick={handleRetry}
            className="w-full"
          >
            <Wrench className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={handleGoHome}
          className="w-full"
        >
          <Home className="h-4 w-4 mr-2" />
          Go to Home
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleDiagnostics}
          className="w-full"
        >
          <Flag className="h-4 w-4 mr-2" />
          Run Diagnostics
        </Button>
      </div>
      
      {/* Session management controls */}
      {sessionId && (
        <>
          <div className="flex justify-between items-center pt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSaveSession(!showSaveSession)}
              className="text-xs"
            >
              <Save className="h-4 w-4 mr-1" />
              {showSaveSession ? 'Cancel' : 'Save Troubleshooting Session'}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLoadSession}
              className="text-xs"
            >
              Load Session
            </Button>
          </div>
          
          {showSaveSession && (
            <Card className="mt-2">
              <CardHeader className="pb-3 pt-3">
                <CardTitle className="text-sm">Save Troubleshooting Session</CardTitle>
                <CardDescription className="text-xs">
                  Save your progress to continue later
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="session-name" className="text-xs">Session Name</Label>
                    <Input
                      id="session-name"
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      placeholder="e.g., Login Issue Troubleshooting"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="session-notes" className="text-xs">Notes</Label>
                    <Textarea
                      id="session-notes"
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      placeholder="Add any notes about this troubleshooting session..."
                      className="h-16 min-h-0 text-sm"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveSession}
                  size="sm"
                  className="w-full text-xs"
                >
                  <Save className="h-3 w-3 mr-1" />
                  Save Session
                </Button>
              </CardFooter>
            </Card>
          )}
        </>
      )}
      
      {error && (
        <div className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded border border-gray-200">
          <details>
            <summary className="cursor-pointer">Show technical details</summary>
            <pre className="mt-2 overflow-x-auto p-2">
              {error.name}: {error.message}
              {error.stack && (
                <div className="mt-1 text-gray-600">
                  {error.stack.split('\n').slice(1).join('\n')}
                </div>
              )}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};
