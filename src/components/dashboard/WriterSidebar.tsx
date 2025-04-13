
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";
import { Separator } from "@/components/ui/separator";
import { PenTool } from "lucide-react";
import { navigationService } from "@/services/navigation/NavigationService";
import { UserRole } from '@/utils/navigation/types';
import WriterNavigationMetrics from './WriterNavigationMetrics';

interface WriterSidebarProps {
  role: UserRole | null;
}

/**
 * Sidebar component for the writer dashboard
 * Extracted from WriterDashboard.tsx to reduce file size
 */
export const WriterSidebar: React.FC<WriterSidebarProps> = ({ role }) => {
  const { navigateTo } = useNavigationHandlers();
  
  // Get role-specific navigation suggestions
  const suggestedRoutes = React.useMemo(() => 
    navigationService.getRoleSuggestedRoutes(role, 5), 
    [role]
  );
  
  return (
    <div className="space-y-6">
      {/* Writer Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Writer Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <PenTool className="h-4 w-4 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium">Weekly Progress</p>
              <p className="text-2xl font-bold">3 / 5</p>
            </div>
          </div>
          
          <div className="h-2 bg-blue-100 rounded mb-3">
            <div className="h-full bg-blue-600 rounded" style={{ width: '60%' }} />
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            You've completed 3 of your 5 weekly writing goals
          </p>
          
          <Separator className="my-3" />
          
          <div className="space-y-2 mt-3">
            <div className="flex justify-between items-center text-sm">
              <span>Documents Created</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Average Time per Doc</span>
              <span className="font-medium">32min</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Completion Rate</span>
              <span className="font-medium">84%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Writer Navigation Metrics */}
      <WriterNavigationMetrics />
      
      {/* Suggested Routes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Navigation</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
            {suggestedRoutes.map((route, index) => (
              <Button 
                key={`${route.path}-${index}`}
                variant="ghost"
                className="w-full justify-start text-left mb-1 h-auto py-2"
                onClick={() => navigateTo(route.path)}
              >
                <div>
                  <div className="font-medium">{route.description}</div>
                  <div className="text-xs text-muted-foreground">{route.path}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Calendar Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="bg-red-100 text-red-800 rounded p-1 mr-3 h-8 w-8 flex items-center justify-center">
                <span className="font-medium">15</span>
              </div>
              <div>
                <p className="font-medium">Product Update</p>
                <p className="text-xs text-muted-foreground">Due Apr 15</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-amber-100 text-amber-800 rounded p-1 mr-3 h-8 w-8 flex items-center justify-center">
                <span className="font-medium">20</span>
              </div>
              <div>
                <p className="font-medium">Weekly Newsletter</p>
                <p className="text-xs text-muted-foreground">Due Apr 20</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="w-full mt-2"
              onClick={() => navigateTo('/content/calendar')}
            >
              View Content Calendar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WriterSidebar;
