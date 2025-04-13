
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { navigationService } from "@/services/navigation/NavigationService";
import { NavigationEvent } from "@/utils/navigation/types";
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useDeepLinking } from "@/hooks/navigation/useDeepLinking";
import { Share2, Download, RefreshCw } from "lucide-react";

/**
 * Component for visualizing navigation history and analytics
 * Primarily for admin use
 */
const NavigationHistoryVisualization: React.FC = () => {
  const [history, setHistory] = useState<NavigationEvent[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { copyShareableLink } = useDeepLinking();
  
  // Fetch navigation history on mount and refreshKey change
  useEffect(() => {
    const events = navigationService.getNavigationHistory();
    setHistory(events);
  }, [refreshKey]);
  
  // Prepare data for visualization
  const successRate = history.length > 0
    ? Math.round((history.filter(e => e.success).length / history.length) * 100)
    : 0;
    
  const roleDistribution = history.reduce((acc, event) => {
    const role = event.userRole || 'unauthenticated';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const roleData = Object.entries(roleDistribution).map(([name, value]) => ({
    name,
    value
  }));
  
  const popularRoutes = history.reduce((acc, event) => {
    if (event.success) {
      acc[event.to] = (acc[event.to] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const routeData = Object.entries(popularRoutes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([route, count]) => ({
      route,
      count
    }));
    
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
  };
  
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(history, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `navigation_history_${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Error exporting navigation history:', error);
    }
  };
  
  const handleShare = () => {
    copyShareableLink('/navigation/history');
  };
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Navigation History Visualization</h1>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Navigation Events</CardTitle>
              <CardDescription>Total tracked events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{history.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Success Rate</CardTitle>
              <CardDescription>Successful navigation percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{successRate}%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Most Active Role</CardTitle>
              <CardDescription>Role with most navigation events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold capitalize">
                {Object.entries(roleDistribution)
                  .sort((a, b) => b[1] - a[1])
                  .map(([role]) => role)[0] || "None"}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="routes">Popular Routes</TabsTrigger>
            <TabsTrigger value="roles">Role Analysis</TabsTrigger>
            <TabsTrigger value="history">Raw History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Navigation Overview</CardTitle>
                <CardDescription>
                  Summary of navigation patterns across the application
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={routeData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 70,
                    }}
                  >
                    <XAxis 
                      dataKey="route" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Visit Count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="routes">
            <Card>
              <CardHeader>
                <CardTitle>Popular Routes</CardTitle>
                <CardDescription>
                  Most frequently visited routes in the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {routeData.map((item, index) => (
                    <div 
                      key={item.route} 
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <div className="flex items-center">
                        <div className="w-6 text-muted-foreground">{index + 1}.</div>
                        <div className="font-medium">{item.route}</div>
                      </div>
                      <Badge variant="secondary">{item.count} visits</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>Role Distribution</CardTitle>
                <CardDescription>
                  Navigation events by user role
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Raw Navigation History</CardTitle>
                <CardDescription>
                  Detailed list of all navigation events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Time</th>
                        <th className="text-left p-2">From</th>
                        <th className="text-left p-2">To</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((event, index) => (
                        <tr 
                          key={`${event.timestamp}-${index}`} 
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-2 whitespace-nowrap">
                            {new Date(event.timestamp).toLocaleString()}
                          </td>
                          <td className="p-2 max-w-[150px] truncate" title={event.from}>
                            {event.from}
                          </td>
                          <td className="p-2 max-w-[150px] truncate" title={event.to}>
                            {event.to}
                          </td>
                          <td className="p-2">
                            <span className="capitalize">{event.userRole || 'unauthenticated'}</span>
                          </td>
                          <td className="p-2">
                            {event.success ? (
                              <Badge variant="success" className="bg-green-100 text-green-800">Success</Badge>
                            ) : (
                              <Badge variant="destructive">{event.failureReason || 'Failed'}</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NavigationHistoryVisualization;
