
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { SmokeTestResult } from "@/hooks/useSmokeTest";

interface TestResultsTableProps {
  results: SmokeTestResult[];
}

export const TestResultsTable: React.FC<TestResultsTableProps> = ({ results }) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Component
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.length > 0 ? (
            results.map((result, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.component}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {result.passed ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" /> Passed
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600">
                      <XCircle className="h-4 w-4 mr-1" /> Failed
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                No test results yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
