
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileText, Check, Filter } from 'lucide-react';

interface TestItem {
  id: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'passed' | 'failed' | 'untested';
  notes: string;
}

export const ManualTestChecklist = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [testItems, setTestItems] = useState<TestItem[]>([
    // Base toolbar tests
    { id: 'base-1', description: 'Base toolbar renders correctly', category: 'base', priority: 'high', status: 'untested', notes: '' },
    { id: 'base-2', description: 'Text formatting buttons (bold, italic) function correctly', category: 'base', priority: 'high', status: 'untested', notes: '' },
    { id: 'base-3', description: 'List controls create appropriate markup', category: 'base', priority: 'medium', status: 'untested', notes: '' },
    { id: 'base-4', description: 'Text alignment controls change text alignment properly', category: 'base', priority: 'medium', status: 'untested', notes: '' },
    { id: 'base-5', description: 'Indentation controls adjust text indentation correctly', category: 'base', priority: 'low', status: 'untested', notes: '' },
    
    // Writer role tests
    { id: 'writer-1', description: 'Writer toolbar components render for writer role', category: 'role-writer', priority: 'high', status: 'untested', notes: '' },
    { id: 'writer-2', description: 'Writer toolbar components do NOT render for designer role', category: 'role-writer', priority: 'high', status: 'untested', notes: '' },
    { id: 'writer-3', description: 'Text controls display correctly for writer role', category: 'role-writer', priority: 'medium', status: 'untested', notes: '' },
    { id: 'writer-4', description: 'EditorToolbar properly shows content for writer role only', category: 'role-writer', priority: 'high', status: 'untested', notes: '' },
    { id: 'writer-5', description: 'StandaloneEditorOnly component correctly shows content for writer role', category: 'role-writer', priority: 'high', status: 'untested', notes: '' },
    { id: 'writer-6', description: 'useIsWriter hook returns true for both writer and editor roles', category: 'role-writer', priority: 'high', status: 'untested', notes: '' },
    { id: 'writer-7', description: 'WriterOnly component shows content for both writer and editor roles', category: 'role-writer', priority: 'high', status: 'untested', notes: '' },
    
    // Designer role tests
    { id: 'designer-1', description: 'Designer toolbar components render for designer role', category: 'role-designer', priority: 'high', status: 'untested', notes: '' },
    { id: 'designer-2', description: 'Designer toolbar components do NOT render for writer role', category: 'role-designer', priority: 'high', status: 'untested', notes: '' },
    { id: 'designer-3', description: 'Designer-specific controls function properly', category: 'role-designer', priority: 'medium', status: 'untested', notes: '' },
    { id: 'designer-4', description: 'DesignerOnly component correctly shows content for designer role only', category: 'role-designer', priority: 'high', status: 'untested', notes: '' },
    
    // Role-based hooks and components
    { id: 'hooks-1', description: 'useIsWriter correctly identifies writer role', category: 'hooks', priority: 'high', status: 'untested', notes: '' },
    { id: 'hooks-2', description: 'useIsWriter correctly identifies legacy editor role', category: 'hooks', priority: 'high', status: 'untested', notes: '' },
    { id: 'hooks-3', description: 'useIsDesigner correctly identifies designer role', category: 'hooks', priority: 'high', status: 'untested', notes: '' },
    { id: 'hooks-4', description: 'WriterOnly component shows content for writer role', category: 'hooks', priority: 'high', status: 'untested', notes: '' },
    { id: 'hooks-5', description: 'DesignerOnly component shows content for designer role', category: 'hooks', priority: 'high', status: 'untested', notes: '' },
    { id: 'hooks-6', description: 'AdminOnly component shows content for admin role', category: 'hooks', priority: 'medium', status: 'untested', notes: '' },
    { id: 'hooks-7', description: 'MultiRoleOnly component works with an array of roles', category: 'hooks', priority: 'medium', status: 'untested', notes: '' },
    
    // Integration tests
    { id: 'integration-1', description: 'Toolbar renders properly when role is changed dynamically', category: 'integration', priority: 'high', status: 'untested', notes: '' },
    { id: 'integration-2', description: 'Role-specific components update when role changes', category: 'integration', priority: 'high', status: 'untested', notes: '' },
    { id: 'integration-3', description: 'Role-based permissions apply correctly across the application', category: 'integration', priority: 'high', status: 'untested', notes: '' },
  ]);

  const updateTestStatus = (id: string, status: 'passed' | 'failed' | 'untested') => {
    setTestItems(items => 
      items.map(item => 
        item.id === id ? { ...item, status } : item
      )
    );

    toast({
      title: `Test #${id} marked as ${status}`,
      duration: 2000,
    });
  };

  const updateTestNotes = (id: string, notes: string) => {
    setTestItems(items => 
      items.map(item => 
        item.id === id ? { ...item, notes } : item
      )
    );
  };

  // Filter and search functionality
  const filteredTests = testItems.filter(item => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const matchesSearch = searchTerm === '' || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Stats calculations
  const totalTests = filteredTests.length;
  const passedTests = filteredTests.filter(item => item.status === 'passed').length;
  const failedTests = filteredTests.filter(item => item.status === 'failed').length;
  const untestedTests = filteredTests.filter(item => item.status === 'untested').length;
  
  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'passed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'untested': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const exportReport = () => {
    const reportData = {
      date: new Date().toISOString(),
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        untested: untestedTests
      },
      tests: testItems
    };
    
    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `role-based-test-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Test report exported",
      description: "Report successfully downloaded as JSON file",
      duration: 3000,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Role-Based Toolbar Component Test Checklist</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="ml-2">
              {totalTests} Tests
            </Badge>
            <Badge className="bg-green-500">
              Passed: {passedTests}
            </Badge>
            <Badge className="bg-red-500">
              Failed: {failedTests}
            </Badge>
            <Badge className="bg-yellow-500">
              Untested: {untestedTests}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Manual test checklist for verifying role-based toolbar components functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4 space-x-2">
          <Input 
            placeholder="Search tests..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          
          <div className="flex-1" />
          
          <div className="flex items-center space-x-1">
            <Filter className="w-4 h-4 mr-1" />
            <span className="text-sm">Filter:</span>
          </div>
          
          <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="base">Base</TabsTrigger>
              <TabsTrigger value="role-writer">Writer Role</TabsTrigger>
              <TabsTrigger value="role-designer">Designer Role</TabsTrigger>
              <TabsTrigger value="hooks">Hooks</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button size="sm" variant="outline" onClick={exportReport}>
            <FileText className="w-4 h-4 mr-1" />
            Export Report
          </Button>
        </div>
        
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {filteredTests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tests match your current filters
              </div>
            ) : (
              filteredTests.map((test) => (
                <Card key={test.id} className="p-4">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="font-medium text-md">{test.id}: {test.description}</span>
                        <Badge variant="outline" className="ml-2">
                          {test.category}
                        </Badge>
                        <Badge variant="outline" className="ml-2">
                          {test.priority} priority
                        </Badge>
                        <Badge className={`ml-2 ${getStatusBadgeColor(test.status)}`}>
                          {test.status}
                        </Badge>
                      </div>
                      
                      <Textarea 
                        placeholder="Add test notes here..."
                        value={test.notes}
                        onChange={(e) => updateTestNotes(test.id, e.target.value)}
                        className="min-h-[80px] mb-2"
                      />
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant={test.status === 'passed' ? 'default' : 'outline'} 
                          className="flex items-center" 
                          onClick={() => updateTestStatus(test.id, 'passed')}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Pass
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant={test.status === 'failed' ? 'destructive' : 'outline'} 
                          onClick={() => updateTestStatus(test.id, 'failed')}
                        >
                          Fail
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant={test.status === 'untested' ? 'secondary' : 'outline'} 
                          onClick={() => updateTestStatus(test.id, 'untested')}
                        >
                          Mark Untested
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
