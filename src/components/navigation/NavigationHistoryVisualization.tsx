
import React, { useState, useEffect } from "react";
import { navigationService } from "@/services/navigation/NavigationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationEvent } from "@/utils/navigation/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";

interface NavigationHistoryVisualizationProps {
  limit?: number;
  showFailures?: boolean;
  interactive?: boolean;
}

/**
 * Visualization component for navigation history
 */
export const NavigationHistoryVisualization: React.FC<NavigationHistoryVisualizationProps> = ({
  limit = 10,
  showFailures = true,
  interactive = true
}) => {
  const [history, setHistory] = useState<NavigationEvent[]>([]);
  const { navigateTo } = useNavigationHandlers();
  
  // Load history on mount
  useEffect(() => {
    const loadHistory = () => {
      const navHistory = navigationService.getRecentNavigationHistory(limit);
      
      // Filter out failures if not showing them
      const filteredHistory = showFailures 
        ? navHistory 
        : navHistory.filter(event => event.success);
      
      setHistory(filteredHistory);
    };
    
    // Initial load
    loadHistory();
    
    // Set up polling interval
    const intervalId = setInterval(loadHistory, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [limit, showFailures]);
  
  // Handle row click if interactive
  const handleRowClick = (event: NavigationEvent) => {
    if (!interactive) return;
    
    // Only navigate to successful destinations
    if (event.success) {
      navigateTo(event.to);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No navigation history available</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead className="w-[150px]">When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((event, index) => (
                <TableRow 
                  key={`${event.timestamp}-${index}`}
                  className={interactive && event.success ? "cursor-pointer hover:bg-gray-50" : ""}
                  onClick={() => handleRowClick(event)}
                >
                  <TableCell>
                    {event.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{event.from}</TableCell>
                  <TableCell className="font-mono text-xs">{event.to}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default NavigationHistoryVisualization;
