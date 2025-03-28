
import React, { useState, useEffect } from 'react';
import { useSmokeTest } from '@/hooks/smoke-testing/useSmokeTest';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  score: number;
}

interface ExampleDataTableProps {
  onTestRunComplete?: (results: any[]) => void;
}

export const ExampleDataTable: React.FC<ExampleDataTableProps> = ({ onTestRunComplete }) => {
  const initialData: User[] = [
    { id: 1, name: "Alice Smith", email: "alice@example.com", score: 85 },
    { id: 2, name: "Bob Johnson", email: "bob@example.com", score: 70 },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", score: 95 },
    { id: 4, name: "Diana Prince", email: "diana@example.com", score: 60 },
    { id: 5, name: "Edward Jones", email: "edward@example.com", score: 90 }
  ];
  
  const [data, setData] = useState<User[]>(initialData);
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [testLog, setTestLog] = useState<string[]>([]);
  
  // Initialize smoke test
  const { testFeature, lastTestResult } = useSmokeTest(
    "ExampleDataTable",
    [sortField, sortDirection], 
    { category: "data" }
  );
  
  // Reset data to initial state
  const resetData = () => {
    setData(initialData);
    setSortField(null);
    setSortDirection('asc');
    setTestLog([]);
    
    // Test reset functionality
    testFeature("resetData", () => {
      if (data.length !== initialData.length) {
        throw new Error("Data reset failed");
      }
      return true;
    });
  };
  
  // Test sorting functionality
  const sortData = (field: keyof User) => {
    // Toggle direction if same field, otherwise default to asc
    const newDirection = 
      sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    
    setSortField(field);
    setSortDirection(newDirection);
    
    // Log this operation
    setTestLog(prev => [
      `Sorting by "${field}" (${newDirection})`,
      ...prev.slice(0, 4) // Keep last 5 entries
    ]);
    
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
      
      // Verify first and last items are correct after sorting
      if (sortedData.length > 0) {
        // Find expected first and last items based on the sort
        const expectedFirst = newDirection === 'asc' 
          ? data.reduce((min, item) => item[field] < min[field] ? item : min, data[0])
          : data.reduce((max, item) => item[field] > max[field] ? item : max, data[0]);
          
        if (sortedData[0].id !== expectedFirst.id) {
          throw new Error(`Sorting failed: expected ID ${expectedFirst.id} to be first`);
        }
      }
      
      return true;
    });
  };
  
  // Report test results
  useEffect(() => {
    if (lastTestResult && onTestRunComplete) {
      onTestRunComplete([lastTestResult]);
    }
  }, [lastTestResult, onTestRunComplete]);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="font-medium">{data.length}</span> users
          {sortField && (
            <span className="ml-2 text-muted-foreground">
              sorted by {sortField} ({sortDirection})
            </span>
          )}
        </div>
        
        <Button variant="outline" size="sm" onClick={resetData}>
          <RefreshCw className="h-3 w-3 mr-1" />
          Reset Data
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => sortData('name')}
                  className="flex items-center gap-1 font-medium"
                >
                  Name
                  {sortField === 'name' ? (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  ) : (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => sortData('email')}
                  className="flex items-center gap-1 font-medium"
                >
                  Email
                  {sortField === 'email' ? (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  ) : (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => sortData('score')}
                  className="flex items-center gap-1 font-medium"
                >
                  Score
                  {sortField === 'score' ? (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  ) : (
                    <ArrowUpDown className="h-3 w-3" />
                  )}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  <Badge variant={row.score >= 90 ? "success" : row.score >= 70 ? "outline" : "secondary"}>
                    {row.score}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm space-y-2">
        <p className="font-medium">Test Log:</p>
        {testLog.length > 0 ? (
          <ul className="text-xs text-muted-foreground space-y-1">
            {testLog.map((log, index) => (
              <li key={index} className="border-l-2 border-muted pl-2">{log}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">No operations performed yet. Try clicking on a column header to sort.</p>
        )}
      </div>
    </div>
  );
};
