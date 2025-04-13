
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";
import { FileText, Edit, BookOpen, Calendar } from "lucide-react";

/**
 * Quick action cards for the writer dashboard
 * Extracted from WriterDashboard.tsx to reduce file size
 */
export const WriterQuickActions: React.FC = () => {
  const { navigateTo } = useNavigationHandlers();
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-blue-700" />
            </div>
            <h3 className="font-semibold mb-2">New Document</h3>
            <p className="text-sm text-gray-600 mb-4">Create a fresh document</p>
            <Button
              onClick={() => navigateTo("/editor")}
              className="w-full"
            >
              Create
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Edit className="h-6 w-6 text-purple-700" />
            </div>
            <h3 className="font-semibold mb-2">My Drafts</h3>
            <p className="text-sm text-gray-600 mb-4">Continue working on drafts</p>
            <Button
              variant="outline"
              onClick={() => navigateTo("/content/drafts")}
              className="w-full"
            >
              View Drafts
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-green-700" />
            </div>
            <h3 className="font-semibold mb-2">Templates</h3>
            <p className="text-sm text-gray-600 mb-4">Use pre-made templates</p>
            <Button
              variant="outline"
              onClick={() => navigateTo("/templates")}
              className="w-full"
            >
              Browse Templates
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-amber-700" />
            </div>
            <h3 className="font-semibold mb-2">Schedule</h3>
            <p className="text-sm text-gray-600 mb-4">View content calendar</p>
            <Button
              variant="outline"
              onClick={() => navigateTo("/content/calendar")}
              className="w-full"
            >
              View Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WriterQuickActions;
