
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ApplicationErrorBoundary } from "@/components/errors";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProjectsProvider } from "@/contexts/ProjectsContext";
import { SearchProvider } from "@/contexts/search/SearchContext";
import { PreferencesProvider } from "@/contexts/preferences/PreferencesContext";
import { NotificationsProvider } from "@/contexts/notifications/NotificationsContext";
import AppRoutes from "@/routes/AppRoutes";
import { useSmokeTest } from "@/hooks/useSmokeTest";

// Configure the query client with consistent settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  useSmokeTest("App");
  
  return (
    <ApplicationErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <PreferencesProvider>
                <NotificationsProvider>
                  <ProjectsProvider>
                    <SearchProvider>
                      <AppRoutes />
                    </SearchProvider>
                  </ProjectsProvider>
                </NotificationsProvider>
              </PreferencesProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ApplicationErrorBoundary>
  );
}

export default App;
