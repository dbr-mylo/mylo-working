
import React, { useState, useEffect } from 'react';
import { useSmokeTest } from '@/hooks/smoke-testing/useSmokeTest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ExampleFormProps {
  onTestRunComplete?: (results: any[]) => void;
}

export const ExampleForm: React.FC<ExampleFormProps> = ({ onTestRunComplete }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  
  // Initialize smoke test
  const { testFeature, lastTestResult, reportError } = useSmokeTest(
    "ExampleForm",
    [], 
    { category: "forms" }
  );
  
  // Test validation logic
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // Test email validation
    try {
      testFeature("emailValidation", () => {
        if (!email) {
          newErrors.email = "Email is required";
          isValid = false;
          return false;
        } else if (!email.includes('@')) {
          newErrors.email = "Email must be valid";
          isValid = false;
          return false;
        }
        return true;
      });
    } catch (error) {
      reportError(error, "emailValidation");
    }
    
    // Test password validation
    try {
      testFeature("passwordValidation", () => {
        if (!password) {
          newErrors.password = "Password is required";
          isValid = false;
          return false;
        } else if (password.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
          isValid = false;
          return false;
        }
        return true;
      });
    } catch (error) {
      reportError(error, "passwordValidation");
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
      // Clear errors if validation passes
      setErrors({});
    }
  };
  
  // Report results to parent
  useEffect(() => {
    if (lastTestResult && onTestRunComplete) {
      onTestRunComplete([lastTestResult]);
    }
  }, [lastTestResult, onTestRunComplete]);
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "border-red-300" : ""}
          />
          {errors.email && (
            <div className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "border-red-300" : ""}
          />
          {errors.password && (
            <div className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.password}
            </div>
          )}
        </div>
        
        <Button type="submit" className="w-full">Submit Form</Button>
      </form>
      
      {submitted && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Form submitted successfully!
        </div>
      )}
      
      <div className="text-sm space-y-2 pt-2 border-t">
        <p className="font-medium">Testing Notes:</p>
        <ul className="list-disc pl-5 text-muted-foreground space-y-1">
          <li>Tests run on form submission and validate each field</li>
          <li>Try submitting with empty fields to trigger validation tests</li>
          <li>Try "test@example" as email to test the format validation</li>
          <li>Try a short password to test length validation</li>
        </ul>
        
        {lastTestResult && (
          <Badge className="mt-2" variant={lastTestResult.passed ? "outline" : "destructive"}>
            Last test: {lastTestResult.passed ? "PASSED" : "FAILED"} - {lastTestResult.component}
          </Badge>
        )}
      </div>
    </div>
  );
};
