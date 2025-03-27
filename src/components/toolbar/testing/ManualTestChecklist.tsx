
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestItem {
  id: string;
  category: string;
  component: string;
  description: string;
  completed: boolean;
  notes: string;
}

const initialTestItems: TestItem[] = [
  // Base Components Tests
  { id: '1', category: 'Base Components', component: 'BaseFormatButtonGroup', description: 'Bold button applies bold formatting', completed: false, notes: '' },
  { id: '2', category: 'Base Components', component: 'BaseFormatButtonGroup', description: 'Italic button applies italic formatting', completed: false, notes: '' },
  { id: '3', category: 'Base Components', component: 'BaseListButtonGroup', description: 'Bullet list button creates bullet lists', completed: false, notes: '' },
  { id: '4', category: 'Base Components', component: 'BaseListButtonGroup', description: 'Ordered list button creates ordered lists', completed: false, notes: '' },
  { id: '5', category: 'Base Components', component: 'BaseAlignmentButtonGroup', description: 'Left align button aligns text to the left', completed: false, notes: '' },
  { id: '6', category: 'Base Components', component: 'BaseAlignmentButtonGroup', description: 'Center align button centers text', completed: false, notes: '' },
  { id: '7', category: 'Base Components', component: 'BaseAlignmentButtonGroup', description: 'Right align button aligns text to the right', completed: false, notes: '' },
  { id: '8', category: 'Base Components', component: 'BaseIndentButtonGroup', description: 'Indent button increases paragraph indentation', completed: false, notes: '' },
  { id: '9', category: 'Base Components', component: 'BaseIndentButtonGroup', description: 'Outdent button decreases paragraph indentation', completed: false, notes: '' },
  { id: '10', category: 'Base Components', component: 'BaseClearFormattingButton', description: 'Clear formatting button removes all formatting', completed: false, notes: '' },
  
  // Writer Role Components Tests
  { id: '11', category: 'Writer Components', component: 'WriterFormatButtonGroup', description: 'Writer role can access and use bold button', completed: false, notes: '' },
  { id: '12', category: 'Writer Components', component: 'WriterFormatButtonGroup', description: 'Writer role can access and use italic button', completed: false, notes: '' },
  { id: '13', category: 'Writer Components', component: 'WriterListButtonGroup', description: 'Writer role can create bullet lists', completed: false, notes: '' },
  { id: '14', category: 'Writer Components', component: 'WriterListButtonGroup', description: 'Writer role can create ordered lists', completed: false, notes: '' },
  { id: '15', category: 'Writer Components', component: 'WriterAlignmentButtonGroup', description: 'Writer role can align text left/center/right', completed: false, notes: '' },
  { id: '16', category: 'Writer Components', component: 'WriterIndentButtonGroup', description: 'Writer role can indent and outdent paragraphs', completed: false, notes: '' },
  { id: '17', category: 'Writer Components', component: 'WriterClearFormattingButton', description: 'Writer role can clear text formatting', completed: false, notes: '' },
  
  // Designer Role Components Tests
  { id: '18', category: 'Designer Components', component: 'DesignerFormatButtonGroup', description: 'Designer role can access and use bold button', completed: false, notes: '' },
  { id: '19', category: 'Designer Components', component: 'DesignerFormatButtonGroup', description: 'Designer role can access and use italic button', completed: false, notes: '' },
  { id: '20', category: 'Designer Components', component: 'DesignerListButtonGroup', description: 'Designer role can create bullet lists', completed: false, notes: '' },
  { id: '21', category: 'Designer Components', component: 'DesignerListButtonGroup', description: 'Designer role can create ordered lists', completed: false, notes: '' },
  { id: '22', category: 'Designer Components', component: 'DesignerAlignmentButtonGroup', description: 'Designer role can align text left/center/right', completed: false, notes: '' },
  { id: '23', category: 'Designer Components', component: 'DesignerIndentButtonGroup', description: 'Designer role can indent and outdent paragraphs', completed: false, notes: '' },
  { id: '24', category: 'Designer Components', component: 'DesignerClearFormattingButton', description: 'Designer role can clear text formatting', completed: false, notes: '' },
  
  // Integration Tests
  { id: '25', category: 'Integration', component: 'Toolbar Integration', description: 'Writer toolbar shows correct components', completed: false, notes: '' },
  { id: '26', category: 'Integration', component: 'Toolbar Integration', description: 'Designer toolbar shows correct components', completed: false, notes: '' },
  { id: '27', category: 'Integration', component: 'Role-based Access', description: 'Writer role gets writer-specific UI', completed: false, notes: '' },
  { id: '28', category: 'Integration', component: 'Role-based Access', description: 'Designer role gets designer-specific UI', completed: false, notes: '' },
  
  // Color Preservation Tests
  { id: '29', category: 'Color Preservation', component: 'Bold with Color', description: 'Bold formatting preserves text color', completed: false, notes: '' },
  { id: '30', category: 'Color Preservation', component: 'Italic with Color', description: 'Italic formatting preserves text color', completed: false, notes: '' },
  { id: '31', category: 'Color Preservation', component: 'Lists with Color', description: 'List formatting preserves text color', completed: false, notes: '' },
  
  // Edge Cases
  { id: '32', category: 'Edge Cases', component: 'No Selection', description: 'Buttons are disabled when no text is selected (if applicable)', completed: false, notes: '' },
  { id: '33', category: 'Edge Cases', component: 'Mixed Formatting', description: 'Buttons show correct state for mixed formatted text', completed: false, notes: '' },
  { id: '34', category: 'Edge Cases', component: 'Long Text', description: 'Toolbar functions correctly with very long text content', completed: false, notes: '' },
  
  // Accessibility Tests
  { id: '35', category: 'Accessibility', component: 'Keyboard Navigation', description: 'All toolbar functions accessible via keyboard', completed: false, notes: '' },
  { id: '36', category: 'Accessibility', component: 'Screen Reader', description: 'Toolbar buttons have proper aria labels', completed: false, notes: '' },
  { id: '37', category: 'Accessibility', component: 'Focus Indicators', description: 'Buttons show clear focus states', completed: false, notes: '' },
  
  // Mobile Tests
  { id: '38', category: 'Responsiveness', component: 'Mobile View', description: 'Toolbar renders correctly on mobile viewports', completed: false, notes: '' },
  { id: '39', category: 'Responsiveness', component: 'Touch Targets', description: 'Buttons are large enough for touch interaction', completed: false, notes: '' },
];

export const ManualTestChecklist = () => {
  const [testItems, setTestItems] = useState<TestItem[]>(initialTestItems);
  const [filter, setFilter] = useState<string>('all');
  const { toast } = useToast();
  
  // Toggle checkbox
  const toggleCheckbox = (id: string) => {
    setTestItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  // Update test item notes
  const updateNotes = (id: string, notes: string) => {
    setTestItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, notes } : item
      )
    );
  };
  
  // Reset all tests
  const resetTests = () => {
    setTestItems(initialTestItems);
    toast({
      title: "Tests Reset",
      description: "All test results have been reset",
    });
  };
  
  // Generate report
  const generateReport = () => {
    const reportDate = new Date().toISOString().split('T')[0];
    const totalTests = testItems.length;
    const completedTests = testItems.filter(item => item.completed).length;
    const passPercentage = Math.round((completedTests / totalTests) * 100);
    
    const report = `
# Toolbar Manual Test Report

Date: ${reportDate}

## Summary
- Total Tests: ${totalTests}
- Completed Tests: ${completedTests}
- Completion: ${passPercentage}%

## Test Results by Category

${Array.from(new Set(testItems.map(item => item.category))).map(category => {
  const categoryItems = testItems.filter(item => item.category === category);
  const categoryCompleted = categoryItems.filter(item => item.completed).length;
  
  return `
### ${category}
- Tests: ${categoryItems.length}
- Completed: ${categoryCompleted}
- Completion: ${Math.round((categoryCompleted / categoryItems.length) * 100)}%

${categoryItems.map(item => `
- [${item.completed ? 'x' : ' '}] ${item.component}: ${item.description}
  ${item.notes ? `  Notes: ${item.notes}` : ''}
`).join('')}
`;
}).join('\n')}
`;
    
    // Create a downloadable text file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toolbar-manual-test-report-${reportDate}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Generated",
      description: "Manual test report has been downloaded",
    });
  };
  
  // Filter test items based on selected filter
  const filteredItems = filter === 'all' 
    ? testItems 
    : testItems.filter(item => item.category === filter);
  
  // Calculate progress
  const progress = {
    total: testItems.length,
    completed: testItems.filter(item => item.completed).length,
    percentage: Math.round((testItems.filter(item => item.completed).length / testItems.length) * 100)
  };
  
  // Get unique categories for filter
  const categories = Array.from(new Set(testItems.map(item => item.category)));
  
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manual Testing Checklist</h2>
        
        <div className="space-x-2">
          <Button 
            onClick={resetTests} 
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw size={16} />
            Reset
          </Button>
          
          <Button 
            onClick={generateReport} 
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <FileText size={16} />
            Generate Report
          </Button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress: {progress.completed}/{progress.total} tests completed</span>
          <span>{progress.percentage}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Button 
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
        >
          All
        </Button>
        
        {categories.map(category => (
          <Button 
            key={category}
            onClick={() => setFilter(category)}
            variant={filter === category ? 'default' : 'outline'}
            size="sm"
          >
            {category}
          </Button>
        ))}
      </div>
      
      <Separator className="my-4" />
      
      {/* Checklist */}
      <div className="space-y-6">
        {Array.from(new Set(filteredItems.map(item => item.category))).map(category => (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-2">{category}</h3>
            
            <div className="space-y-3">
              {filteredItems
                .filter(item => item.category === category)
                .map(item => (
                  <div key={item.id} className="grid grid-cols-[auto,1fr] gap-3 items-start p-3 border rounded-md bg-card">
                    <Checkbox 
                      id={`test-${item.id}`} 
                      checked={item.completed}
                      onCheckedChange={() => toggleCheckbox(item.id)}
                    />
                    
                    <div>
                      <label 
                        htmlFor={`test-${item.id}`}
                        className="font-medium cursor-pointer flex flex-col sm:flex-row sm:justify-between"
                      >
                        <span className="text-sm">{item.component}: {item.description}</span>
                        <span className={`text-xs ${item.completed ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {item.completed ? 'Completed' : 'Pending'}
                        </span>
                      </label>
                      
                      <textarea
                        placeholder="Add notes here..."
                        className="mt-2 w-full p-2 text-sm bg-muted/50 border rounded-md min-h-[60px]"
                        value={item.notes}
                        onChange={(e) => updateNotes(item.id, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
