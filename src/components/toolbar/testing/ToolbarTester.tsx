
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { RoleSystemAnalysis } from './RoleSystemAnalysis';
import { 
  RoleSelector, 
  RoleAlert, 
  TestResults, 
  ContentPreview,
  RoleHookTestTab
} from './components';
import { useToolbarTesting } from './hooks';

export const ToolbarTester = () => {
  const { 
    currentTest, 
    setCurrentTest, 
    content, 
    testResults, 
    selectedRoleForTesting, 
    setSelectedRoleForTesting,
    runTest 
  } = useToolbarTesting();
  
  const { role } = useAuth();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Toolbar Component Tester</CardTitle>
          <CardDescription>
            Test different toolbar component implementations to ensure they work correctly
            after refactoring, with special focus on role-based access control.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 border rounded-md bg-muted/40">
            <RoleSelector 
              selectedRole={selectedRoleForTesting}
              setSelectedRole={setSelectedRoleForTesting}
            />
            
            <RoleAlert />
          </div>
          
          <Tabs
            value={currentTest}
            onValueChange={(value) => {
              setCurrentTest(value);
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="base">Base Components</TabsTrigger>
              <TabsTrigger value="writer">Writer Toolbar</TabsTrigger>
              <TabsTrigger value="designer">Designer Toolbar</TabsTrigger>
              <TabsTrigger value="role-hooks">Role Hooks</TabsTrigger>
            </TabsList>
            
            <div className="flex justify-end mb-4">
              <Button onClick={() => runTest(currentTest)}>
                Run {currentTest === 'base' ? 'Base' : 
                    currentTest === 'writer' ? 'Writer' : 
                    currentTest === 'designer' ? 'Designer' : 'Role Hooks'} Tests
              </Button>
            </div>
            
            <TabsContent value="base" className="space-y-4">
              <ContentPreview 
                content={content} 
                label="Base Components Test Preview" 
              />
            </TabsContent>
            
            <TabsContent value="writer" className="space-y-4">
              <ContentPreview 
                content={content} 
                label="Writer Components Test Preview" 
              />
            </TabsContent>
            
            <TabsContent value="designer" className="space-y-4">
              <ContentPreview 
                content={content} 
                label="Designer Components Test Preview" 
              />
            </TabsContent>
            
            <TabsContent value="role-hooks" className="space-y-4">
              <RoleHookTestTab role={role} />
            </TabsContent>
          </Tabs>
          
          <TestResults results={testResults} />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reset Tests
          </Button>
        </CardFooter>
      </Card>
      
      <RoleSystemAnalysis />
    </div>
  );
};
