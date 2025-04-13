
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { navigationService } from "@/services/navigation/NavigationService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, Star, RefreshCw } from "lucide-react";

/**
 * Component for displaying writer-specific navigation metrics on the dashboard
 */
export const WriterNavigationMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [recentHistory, setRecentHistory] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { navigateTo } = useNavigationHandlers();
  
  // Get writer-specific metrics and recent history
  useEffect(() => {
    const writerMetrics = navigationService.getWriterNavigationMetrics();
    setMetrics(writerMetrics);
    
    const history = navigationService.getRecentNavigationHistory(10);
    setRecentHistory(history);
  }, [refreshKey]);
  
  // Format paths for display
  const formatPath = (path: string): string => {
    if (path.length > 25) {
      return path.substring(0, 25) + '...';
    }
    return path;
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  // Get most frequent routes
  const frequentRoutes = Object.entries(metrics)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Your Navigation</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
        <CardDescription>Navigation patterns and history</CardDescription>
      </CardHeader>
      
      <CardContent className="px-2">
        <ScrollArea className="h-[200px]">
          <div className="space-y-1 px-2">
            {frequentRoutes.length > 0 ? (
              <>
                <div className="py-1 mb-2 text-sm font-medium">
                  Most Visited Pages
                </div>
                {frequentRoutes.map(([path, count]) => (
                  <Button
                    key={path}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-left h-auto py-1.5"
                    onClick={() => navigateTo(path)}
                  >
                    <div className="flex items-center">
                      <Star className="h-3 w-3 mr-2 text-amber-500" />
                      <span className="truncate max-w-[180px]" title={path}>
                        {formatPath(path)}
                      </span>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {count}x
                    </Badge>
                  </Button>
                ))}
              </>
            ) : (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No navigation data yet
              </div>
            )}
            
            {recentHistory.length > 0 && (
              <>
                <div className="py-1 mt-3 mb-2 text-sm font-medium">
                  Recent Navigation
                </div>
                {recentHistory.map((event, index) => (
                  <div 
                    key={`${event.timestamp}-${index}`}
                    className="flex items-center py-1 text-sm"
                  >
                    <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="truncate max-w-[110px]" title={event.from}>
                      {formatPath(event.from)}
                    </span>
                    <ArrowRight className="h-3 w-3 mx-2 text-muted-foreground" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6"
                      onClick={() => navigateTo(event.to)}
                    >
                      <span className="truncate max-w-[110px]" title={event.to}>
                        {formatPath(event.to)}
                      </span>
                    </Button>
                  </div>
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default WriterNavigationMetrics;
