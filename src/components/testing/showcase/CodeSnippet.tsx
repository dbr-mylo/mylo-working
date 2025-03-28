
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Code snippets for different examples
const CODE_EXAMPLES: Record<string, string> = {
  counter: `// Example of useSmokeTest in a Counter component
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSmokeTest } from '@/hooks/smoke-testing/useSmokeTest';

export const ExampleCounter = ({ onTestRunComplete }) => {
  const [count, setCount] = useState(0);
  
  // Initialize smoke test with component name and options
  const { testFeature, lastTestResult } = useSmokeTest(
    "ExampleCounter",
    [count], // Dependencies to watch
    { 
      category: "examples",
      context: { initialCount: 0 }
    }
  );
  
  // Test increment functionality
  const increment = () => {
    const prevCount = count;
    setCount(prevCount + 1);
    
    // Test if the increment worked as expected
    testFeature("increment", () => {
      if (count !== prevCount + 1) {
        throw new Error("Increment failed");
      }
    });
  };
  
  // Report test results to parent
  useEffect(() => {
    if (lastTestResult) {
      onTestRunComplete([lastTestResult]);
    }
  }, [lastTestResult, onTestRunComplete]);
  
  return (
    <div className="flex items-center gap-4">
      <Button onClick={increment}>
        Increment
      </Button>
      <span>Count: {count}</span>
    </div>
  );
};`,

  form: `// Example of validation testing in a form
import { useState, useEffect } from 'react';
import { useSmokeTest } from '@/hooks/smoke-testing/useSmokeTest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const ExampleForm = ({ onTestRunComplete }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  
  // Initialize smoke test
  const { testFeature, lastTestResult, reportError } = useSmokeTest(
    "ExampleForm",
    [], 
    { category: "forms" }
  );
  
  // Test validation logic
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Test email validation
    testFeature("emailValidation", () => {
      if (!email) {
        newErrors.email = "Email is required";
        isValid = false;
      } else if (!email.includes('@')) {
        newErrors.email = "Email must be valid";
        isValid = false;
      }
      return isValid;
    });
    
    // Test password validation
    testFeature("passwordValidation", () => {
      if (!password) {
        newErrors.password = "Password is required";
        isValid = false;
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        isValid = false;
      }
      return isValid;
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Report results to parent
  useEffect(() => {
    if (lastTestResult) {
      onTestRunComplete([lastTestResult]);
    }
  }, [lastTestResult, onTestRunComplete]);
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (validateForm()) {
        // Submit form
      }
    }}>
      <div className="space-y-4">
        {/* Form fields */}
      </div>
    </form>
  );
};`,

  data: `// Example of data table with sorting tests
import { useState, useEffect } from 'react';
import { useSmokeTest } from '@/hooks/smoke-testing/useSmokeTest';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';

export const ExampleDataTable = ({ onTestRunComplete }) => {
  const [data, setData] = useState([
    { id: 1, name: "Alice", score: 85 },
    { id: 2, name: "Bob", score: 70 },
    { id: 3, name: "Charlie", score: 95 }
  ]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Initialize smoke test
  const { testFeature, lastTestResult } = useSmokeTest(
    "ExampleDataTable",
    [sortField, sortDirection], 
    { category: "data" }
  );
  
  // Test sorting functionality
  const sortData = (field) => {
    const newDirection = 
      sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    
    setSortField(field);
    setSortDirection(newDirection);
    
    // Test sorting logic
    testFeature("sortData", () => {
      const sortedData = [...data].sort((a, b) => {
        if (newDirection === 'asc') {
          return a[field] > b[field] ? 1 : -1;
        } else {
          return a[field] < b[field] ? 1 : -1;
        }
      });
      
      setData(sortedData);
      
      // Verify first item is correct
      if (sortedData.length > 0) {
        const expectedFirstItem = newDirection === 'asc' 
          ? data.reduce((min, item) => item[field] < min[field] ? item : min, data[0])
          : data.reduce((max, item) => item[field] > max[field] ? item : max, data[0]);
          
        if (sortedData[0].id !== expectedFirstItem.id) {
          throw new Error("Sorting failed");
        }
      }
    });
  };
  
  // Report test results
  useEffect(() => {
    if (lastTestResult) {
      onTestRunComplete([lastTestResult]);
    }
  }, [lastTestResult, onTestRunComplete]);
  
  return (
    <Table>
      {/* Table implementation */}
    </Table>
  );
};`,

  editor: `// Example of document editor integration
import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useSmokeTest } from '@/hooks/smoke-testing/useSmokeTest';
import { useDocumentTesting } from '@/components/toolbar/testing/hooks';

export const ExampleDocumentEditor = ({ onTestRunComplete }) => {
  // Setup editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
  });
  
  // Initialize smoke test
  const { testFeature } = useSmokeTest(
    "ExampleDocumentEditor",
    [editor?.isEditable], 
    { category: "editor" }
  );
  
  // Use the document testing hook
  const { 
    testResults,
    stats,
    runTests,
    isRunning 
  } = useDocumentTesting({
    editor,
    runOnMount: false,
    maxRetries: 1
  });
  
  // Test editor functionality
  const testBoldFormat = () => {
    testFeature("boldFormat", () => {
      if (!editor) throw new Error("Editor not available");
      
      editor.commands.selectAll();
      editor.commands.setBold();
      
      if (!editor.isActive('bold')) {
        throw new Error("Bold formatting failed");
      }
    });
  };
  
  // Report test results
  useEffect(() => {
    if (Object.keys(testResults).length > 0) {
      const resultArray = Object.entries(testResults).map(
        ([id, result]) => ({
          component: id,
          passed: result.passed,
          timestamp: result.timestamp || new Date().toISOString(),
          error: result.passed ? undefined : result.message
        })
      );
      
      onTestRunComplete(resultArray);
    }
  }, [testResults, onTestRunComplete]);
  
  return (
    <div className="space-y-4">
      <EditorContent editor={editor} />
      <div className="space-x-2">
        {/* Editor controls and test buttons */}
      </div>
    </div>
  );
};`
};

interface CodeSnippetProps {
  example: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ example }) => {
  const code = CODE_EXAMPLES[example] || 'No code example available';
  
  return (
    <ScrollArea className="h-[500px] w-full rounded-md bg-muted">
      <div className="p-4">
        <pre className="text-sm font-mono whitespace-pre-wrap break-all">
          {code}
        </pre>
      </div>
    </ScrollArea>
  );
};
