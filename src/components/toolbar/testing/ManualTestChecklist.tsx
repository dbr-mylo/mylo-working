
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { usePersistentTestResults } from './hooks';
import { useTestFiltering } from './hooks/useTestFiltering';
import { TestFilters } from './components/TestFilters';
import { TestStats } from './components/TestStats';
import { TestItemComponent } from './components/TestItem';
import { getStatusBadgeColor, exportTestReport } from './utils/testUtils';
import { initialTestItems } from './data/initialTestData';

export const ManualTestChecklist = () => {
  const { toast } = useToast();
  
  const { 
    testItems, 
    updateTestStatus, 
    updateTestNotes, 
    resetAllTests 
  } = usePersistentTestResults(initialTestItems);

  const {
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    filteredTests,
    stats
  } = useTestFiltering(testItems);

  const handleExportReport = () => {
    exportTestReport(testItems, stats, toast);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Role-Based Toolbar Component Test Checklist</span>
          <TestStats 
            totalTests={stats.totalTests}
            passedTests={stats.passedTests}
            failedTests={stats.failedTests}
            untestedTests={stats.untestedTests}
          />
        </CardTitle>
        <CardDescription>
          Manual test checklist for verifying role-based toolbar components functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TestFilters 
          filter={filter}
          setFilter={setFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onExport={handleExportReport}
          onReset={resetAllTests}
        />
        
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {filteredTests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tests match your current filters
              </div>
            ) : (
              filteredTests.map((test) => (
                <TestItemComponent 
                  key={test.id}
                  test={test}
                  updateTestStatus={updateTestStatus}
                  updateTestNotes={updateTestNotes}
                  getStatusBadgeColor={getStatusBadgeColor}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
