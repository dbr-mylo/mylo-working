
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

export const RoleSystemMigrationStatus: React.FC = () => {
  // Migration progress metrics (these would come from actual analysis in a real implementation)
  const migrationMetrics = {
    componentsTotal: 42,
    componentsMigrated: 36,
    hooksTotal: 18,
    hooksMigrated: 17,
    routesTotal: 12,
    routesMigrated: 10
  };

  // Calculate percentages
  const componentProgress = Math.round((migrationMetrics.componentsMigrated / migrationMetrics.componentsTotal) * 100);
  const hooksProgress = Math.round((migrationMetrics.hooksMigrated / migrationMetrics.hooksTotal) * 100);
  const routesProgress = Math.round((migrationMetrics.routesMigrated / migrationMetrics.routesTotal) * 100);
  const overallProgress = Math.round(
    ((migrationMetrics.componentsMigrated + migrationMetrics.hooksMigrated + migrationMetrics.routesMigrated) /
    (migrationMetrics.componentsTotal + migrationMetrics.hooksTotal + migrationMetrics.routesTotal)) * 100
  );

  // Potential issues found (sample data)
  const potentialIssues = [
    {
      component: 'src/components/editor/toolbar/EditorToolbar.tsx',
      issue: 'Still using direct role comparison instead of useIsWriter()',
      severity: 'medium'
    },
    {
      component: 'src/routes/EditorRoute.tsx',
      issue: 'Needs to be updated to use WriterRoute component',
      severity: 'high'
    },
    {
      component: 'src/components/editor/EditorPanel.tsx',
      issue: 'Inconsistent role checking pattern',
      severity: 'low'
    }
  ];

  // Components that need to be migrated (sample data)
  const pendingComponents = [
    {
      name: 'EditorToolbar',
      path: 'src/components/editor/toolbar/EditorToolbar.tsx',
      status: 'In Progress',
      complexity: 'Medium'
    },
    {
      name: 'EditorPanel',
      path: 'src/components/editor/EditorPanel.tsx',
      status: 'Not Started',
      complexity: 'High'
    },
    {
      name: 'DocumentActions',
      path: 'src/components/document/DocumentActions.tsx',
      status: 'Not Started',
      complexity: 'Low'
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Role System Migration Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Overall Migration Progress</h3>
              <span className="text-sm">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          {/* Categories progress */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium">Components</h4>
                <span className="text-xs">{componentProgress}%</span>
              </div>
              <Progress value={componentProgress} className="h-1.5" />
              <p className="text-xs text-muted-foreground mt-1">
                {migrationMetrics.componentsMigrated}/{migrationMetrics.componentsTotal} components
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium">Hooks</h4>
                <span className="text-xs">{hooksProgress}%</span>
              </div>
              <Progress value={hooksProgress} className="h-1.5" />
              <p className="text-xs text-muted-foreground mt-1">
                {migrationMetrics.hooksMigrated}/{migrationMetrics.hooksTotal} hooks
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium">Routes</h4>
                <span className="text-xs">{routesProgress}%</span>
              </div>
              <Progress value={routesProgress} className="h-1.5" />
              <p className="text-xs text-muted-foreground mt-1">
                {migrationMetrics.routesMigrated}/{migrationMetrics.routesTotal} routes
              </p>
            </div>
          </div>

          {/* Tabs for details */}
          <Tabs defaultValue="issues">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="issues">Potential Issues</TabsTrigger>
              <TabsTrigger value="pending">Pending Components</TabsTrigger>
              <TabsTrigger value="guidance">Migration Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="issues" className="space-y-4 pt-4">
              {potentialIssues.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Component</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead className="w-[100px]">Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {potentialIssues.map((issue, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-xs">{issue.component}</TableCell>
                        <TableCell>{issue.issue}</TableCell>
                        <TableCell>
                          <Badge variant={
                            issue.severity === 'high' ? 'destructive' : 
                            issue.severity === 'medium' ? 'default' : 'outline'
                          }>
                            {issue.severity}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>No issues detected! All components are using the correct role patterns.</AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4 pt-4">
              {pendingComponents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead className="w-[280px]">Path</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[100px]">Complexity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingComponents.map((component, index) => (
                      <TableRow key={index}>
                        <TableCell>{component.name}</TableCell>
                        <TableCell className="font-mono text-xs">{component.path}</TableCell>
                        <TableCell>
                          <Badge variant={
                            component.status === 'Not Started' ? 'outline' : 
                            component.status === 'In Progress' ? 'default' : 'outline'
                          }>
                            {component.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {component.complexity}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>All components have been migrated to the new role system!</AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="guidance" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex gap-2 items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium">Use Role Hooks</h3>
                    <p className="text-sm text-muted-foreground">
                      Replace direct role checks with <code className="text-xs">useIsWriter()</code>, <code className="text-xs">useIsDesigner()</code>, etc.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium">Avoid Nested Role Components</h3>
                    <p className="text-sm text-muted-foreground">
                      Use <code className="text-xs">MultiRoleOnly</code> instead of nesting multiple role components.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 items-start">
                  <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Refer to <code className="text-xs">src/docs/ROLE_BASED_COMPONENT_GUIDE.md</code> for detailed instructions and examples.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
