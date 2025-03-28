
import React from 'react';
import { 
  usePersistentTestResults, 
  TestItem 
} from './hooks/usePersistentTestResults';
import { useTestFiltering } from './hooks/useTestFiltering';
import { TestFilters } from './components/TestFilters';
import { TestStats } from './components/TestStats';
import { TestDashboard } from './components/TestDashboard';
import { TestItemComponent } from './components/TestItem';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';

export const TestPage: React.FC = () => {
  const {
    testItems,
    updateTestStatus,
    updateTestNotes,
    resetAllTests,
    exportTests,
    getStatusBadgeColor
  } = usePersistentTestResults();

  const {
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    searchTerm,
    setSearchTerm,
    filteredTests,
    stats
  } = useTestFiltering(testItems);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Role Based Testing Suite</h1>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Test
        </Button>
      </div>
      
      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tests">Test Cases</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4 py-4">
          <TestDashboard testItems={testItems} />
        </TabsContent>
        
        <TabsContent value="tests" className="space-y-4 py-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Test Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TestFilters
                filter={categoryFilter}
                setFilter={setCategoryFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onExport={exportTests}
                onReset={resetAllTests}
              />
              
              <div className="pt-2 pb-4">
                <TestStats
                  totalTests={stats.totalTests}
                  passedTests={stats.passedTests}
                  failedTests={stats.failedTests}
                  untestedTests={stats.untestedTests}
                />
              </div>
              
              <div className="space-y-4">
                {filteredTests.length > 0 ? (
                  filteredTests.map(test => (
                    <TestItemComponent
                      key={test.id}
                      test={test}
                      updateTestStatus={updateTestStatus}
                      updateTestNotes={updateTestNotes}
                      getStatusBadgeColor={getStatusBadgeColor}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No tests match the current filters. Try adjusting your search criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
