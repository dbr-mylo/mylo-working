
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestResult } from '../hooks/useTestExecution';
import { PERFORMANCE_TEST_ITERATIONS } from '../testCases';

interface PerformanceResultCardProps {
  result: TestResult;
}

export const PerformanceResultCard: React.FC<PerformanceResultCardProps> = ({ result }) => {
  const iterations = PERFORMANCE_TEST_ITERATIONS;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-medium mb-4">{result.case.name}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="text-sm font-medium mb-1">Standard Extraction</h4>
            <div className="text-2xl font-semibold">
              {result.result.regularTime.toFixed(2)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              {(iterations / (result.result.regularTime / 1000)).toFixed(0)} ops/sec
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="text-sm font-medium mb-1">Memoized (No Cache)</h4>
            <div className="text-2xl font-semibold">
              {result.result.memoizedTime.toFixed(2)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              {(iterations / (result.result.memoizedTime / 1000)).toFixed(0)} ops/sec
            </p>
          </div>
          
          {result.result.memoizedCached !== undefined && (
            <div className="p-4 border rounded-lg bg-green-50">
              <h4 className="text-sm font-medium mb-1">Memoized (With Cache)</h4>
              <div className="text-2xl font-semibold text-green-700">
                {result.result.memoizedCached.toFixed(2)}ms
              </div>
              <p className="text-xs text-muted-foreground">
                {(iterations / (result.result.memoizedCached / 1000)).toFixed(0)} ops/sec
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Performance Comparison</h4>
          <div className="space-y-2">
            {result.result.memoizedCached !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Cache Speed Improvement:</span>
                <Badge 
                  variant="outline"
                  className="bg-green-50 text-green-700"
                >
                  {((result.result.regularTime - result.result.memoizedCached) / result.result.regularTime * 100).toFixed(1)}% faster
                </Badge>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Memoization Overhead (First Run):</span>
              <Badge 
                variant="outline"
                className={
                  result.result.memoizedTime > result.result.regularTime 
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-green-50 text-green-700"
                }
              >
                {Math.abs(result.result.memoizedTime - result.result.regularTime).toFixed(2)}ms 
                ({result.result.memoizedTime > result.result.regularTime ? 'slower' : 'faster'})
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
