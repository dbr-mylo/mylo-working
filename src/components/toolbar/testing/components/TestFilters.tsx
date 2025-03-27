
import React from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, RefreshCw, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestFiltersProps {
  filter: string;
  setFilter: (filter: string) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  onExport: () => void;
  onReset: () => void;
}

export const TestFilters: React.FC<TestFiltersProps> = ({
  filter,
  setFilter,
  searchTerm,
  setSearchTerm,
  onExport,
  onReset
}) => {
  const { toast } = useToast();

  const handleResetAllTests = () => {
    if (confirm('Are you sure you want to reset all test results? This action cannot be undone.')) {
      onReset();
      toast({
        title: "All tests reset",
        description: "All test results have been reset to untested",
        duration: 3000,
      });
    }
  };

  return (
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
      
      <Button size="sm" variant="outline" onClick={onExport}>
        <FileText className="w-4 h-4 mr-1" />
        Export Report
      </Button>
      
      <Button size="sm" variant="outline" onClick={handleResetAllTests}>
        <RefreshCw className="w-4 h-4 mr-1" />
        Reset All
      </Button>
    </div>
  );
};
