
import React, { useState, useEffect } from "react";
import { navigationService } from "@/services/navigation/NavigationService";
import { NavigationEvent } from "@/utils/navigation/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Clock, ArrowRight, ExternalLink, RefreshCw, Trash2 } from "lucide-react";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NavigationHistoryVisualization: React.FC = () => {
  const [history, setHistory] = useState<NavigationEvent[]>([]);
  const [frequentRoutes, setFrequentRoutes] = useState<{ path: string; count: number }[]>([]);
  const { navigateTo } = useNavigationHandlers();
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(10);
  
  // Load history data
  useEffect(() => {
    refreshData();
  }, []);
  
  // Filter history based on role
  const filteredHistory = React.useMemo(() => {
    if (!filterRole) return history;
    return history.filter(event => event.userRole === filterRole);
  }, [history, filterRole]);
  
  // Get displayed history based on visible count
  const displayedHistory = React.useMemo(() => {
    return filteredHistory.slice(0, visibleCount);
  }, [filteredHistory, visibleCount]);
  
  const refreshData = () => {
    setHistory(navigationService.getNavigationHistory());
    setFrequentRoutes(navigationService.getMostFrequentRoutes(5));
  };
  
  const clearHistory = () => {
    navigationService.clearNavigationHistory();
    refreshData();
  };
  
  const formatDate = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString();
    } catch (e) {
      return "Invalid date";
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between">
            Navigation History
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button variant="destructive" size="sm" onClick={clearHistory}>
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Track and analyze user navigation patterns across the application
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <Tabs defaultValue="history">
            <TabsList className="mb-4">
              <TabsTrigger value="history">Navigation History</TabsTrigger>
              <TabsTrigger value="frequent">Frequent Routes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Recent Navigation Events</CardTitle>
                  <CardDescription>
                    The most recent page navigation activities
                  </CardDescription>
                  
                  <div className="flex justify-between mt-2">
                    <Select
                      value={filterRole || ""}
                      onValueChange={(value) => setFilterRole(value === "" ? null : value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="writer">Writer</SelectItem>
                        <SelectItem value="designer">Designer</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={visibleCount.toString()} 
                      onValueChange={(value) => setVisibleCount(parseInt(value))}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Items to show" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">Show 10</SelectItem>
                        <SelectItem value="25">Show 25</SelectItem>
                        <SelectItem value="50">Show 50</SelectItem>
                        <SelectItem value="100">Show 100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {displayedHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No navigation history available
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {displayedHistory.map((event, index) => (
                        <div 
                          key={`${event.timestamp}-${index}`}
                          className="flex items-start border-b pb-3 last:border-b-0"
                        >
                          <div className="mr-4 pt-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-medium">{formatDate(event.timestamp)}</span>
                              {event.userRole && (
                                <Badge variant="outline" className="text-xs">
                                  {event.userRole}
                                </Badge>
                              )}
                              <Badge 
                                variant={event.success ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {event.success ? "Success" : "Failed"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="truncate max-w-[150px]">{event.from || "/"}</span>
                              <ArrowRight className="h-3 w-3" />
                              <span className="truncate max-w-[150px] font-medium">{event.to}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 ml-auto"
                                onClick={() => navigateTo(event.to)}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                            {event.failureReason && (
                              <p className="text-xs text-destructive mt-1">{event.failureReason}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {displayedHistory.length} of {filteredHistory.length} events
                  </div>
                  {filteredHistory.length > visibleCount && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setVisibleCount(prev => prev + 10)}
                    >
                      Show More
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="frequent">
              <Card>
                <CardHeader>
                  <CardTitle>Most Frequently Visited Routes</CardTitle>
                  <CardDescription>
                    The most commonly accessed paths in the application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {frequentRoutes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No route frequency data available
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {frequentRoutes.map((route, index) => (
                        <div 
                          key={`${route.path}-${index}`}
                          className="flex items-center justify-between border-b pb-3 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-muted rounded-md p-2">
                              <BarChart className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{route.path}</p>
                              <p className="text-sm text-muted-foreground">
                                Visited {route.count} times
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigateTo(route.path)}
                          >
                            Visit
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Analytics</CardTitle>
              <CardDescription>
                Key insights from navigation patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Total Navigation Events</h3>
                <p className="text-2xl font-bold">{history.length}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Successful Navigations</h3>
                <p className="text-2xl font-bold">
                  {history.filter(e => e.success).length} 
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    ({Math.round(history.filter(e => e.success).length / Math.max(history.length, 1) * 100)}%)
                  </span>
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Failed Navigations</h3>
                <p className="text-2xl font-bold">
                  {history.filter(e => !e.success).length}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    ({Math.round(history.filter(e => !e.success).length / Math.max(history.length, 1) * 100)}%)
                  </span>
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Role Distribution</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['admin', 'writer', 'designer', null].map(role => {
                    const count = history.filter(e => e.userRole === role).length;
                    return (
                      <div key={role || 'unauthenticated'} className="bg-muted/50 p-2 rounded-md">
                        <p className="font-medium">{role || 'Unauthenticated'}</p>
                        <p className="text-sm text-muted-foreground">{count} visits</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NavigationHistoryVisualization;
