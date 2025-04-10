import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin, useIsWriter, useIsDesigner } from "@/utils/roles";
import { DesignerRoute, WriterRoute } from "@/components/routes/ProtectedRoutes";
import React, { useEffect } from "react";
import Index from "./pages/Index";
import DocumentSelection from "./pages/DocumentSelection";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import RegressionTestRoute from "./routes/RegressionTestRoute";
import SmokeTestRoute from "./routes/SmokeTestRoute";
import { TemplateManager } from "@/components/design/TemplateManager";
import { ErrorBoundary, RoleAwareErrorFallback } from "@/components/errors";
import { isValidRoute, logNavigation } from "@/utils/navigation/routeValidation";
import { useSmokeTest } from "@/hooks/useSmokeTest";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProjectsProvider } from "@/contexts/ProjectsContext";
import { SearchProvider } from "@/contexts/search/SearchContext";
import { PreferencesProvider } from "@/contexts/preferences/PreferencesContext";
import { NotificationsProvider } from "@/contexts/notifications/NotificationsContext";

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

const RouteValidator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuth();
  
  useEffect(() => {
    const isValid = isValidRoute(location.pathname, role);
    
    logNavigation(
      location.state?.from || "unknown", 
      location.pathname, 
      isValid
    );
    
    if (!isValid && location.pathname !== "/not-found") {
      console.warn(`Invalid route detected: ${location.pathname} for role: ${role || 'unauthenticated'}`);
      navigate("/not-found", { 
        state: { 
          from: location.pathname, 
          message: "Route not available for your role" 
        } 
      });
    }
  }, [location.pathname, role, navigate, location.state]);
  
  return null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, role } = useAuth();
  useSmokeTest("ProtectedRoute");
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user && !role) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = useIsAdmin();
  const { user, isLoading } = useAuth();
  useSmokeTest("AdminRoute");
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  useSmokeTest("AuthRoute");
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const DesignerPages = () => {
  useSmokeTest("DesignerPages");
  
  return (
    <Routes>
      <Route path="/templates" element={<TemplateManager />} />
      <Route path="/design-settings" element={<div>Design Settings (Coming Soon)</div>} />
      <Route path="/layout" element={<div>Layout Editor (Coming Soon)</div>} />
      <Route path="*" element={<Navigate to="/editor" />} />
    </Routes>
  );
};

const WriterPages = () => {
  useSmokeTest("WriterPages");
  
  return (
    <Routes>
      <Route path="/documents" element={<DocumentSelection />} />
      <Route path="/drafts" element={<div>Drafts (Coming Soon)</div>} />
      <Route path="*" element={<Navigate to="/editor" />} />
    </Routes>
  );
};

const AppRoutes = () => {
  useSmokeTest("AppRoutes");
  
  return (
    <ErrorBoundary context="AppRoutes" fallback={<RoleAwareErrorFallback error={new Error("Application failed to load")} context="application" />}>
      <RouteValidator />
      <Routes>
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/documents" element={<ProtectedRoute><DocumentSelection /></ProtectedRoute>} />
        <Route path="/editor" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/editor/:documentId" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        
        <Route path="/design/*" element={<DesignerRoute><DesignerPages /></DesignerRoute>} />
        <Route path="/content/*" element={<WriterRoute><WriterPages /></WriterRoute>} />
        
        <Route path="/templates" element={<DesignerRoute><TemplateManager /></DesignerRoute>} />
        
        <Route path="/admin" element={<AdminRoute><div>Admin Panel Coming Soon</div></AdminRoute>} />
        
        <Route path="/testing/regression" element={<RegressionTestRoute />} />
        <Route path="/testing/smoke" element={<SmokeTestRoute />} />
        
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>
    </ErrorBoundary>
  );
};

function App() {
  useSmokeTest("App");
  
  return (
    <ErrorBoundary context="App">
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
    </ErrorBoundary>
  );
}

export default App;
