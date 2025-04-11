
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";
import { RoleNavigation } from "./RoleNavigation";

export const RoleNavigationWithTooltips: React.FC = () => {
  const { role } = useAuth();
  
  return (
    <ErrorBoundary context="RoleNavigationWithTooltips">
      <TooltipProvider>
        <div className="flex items-center space-x-4">
          {/* Example of a writer trying to access designer features */}
          {role === "writer" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="text-gray-400 cursor-not-allowed p-2 rounded-md"
                  disabled
                >
                  <Layout className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Design features are only available for Designer role</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          <RoleNavigation navigateTo={() => {}} />
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  );
};
