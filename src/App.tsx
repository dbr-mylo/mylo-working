
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin, useIsWriter, useIsDesigner } from "@/utils/roles";
import { DesignerRoute, WriterRoute } from "@/components/routes/ProtectedRoutes";
import React from "react";
import Index from "./pages/Index";
import DocumentSelection from "./pages/DocumentSelection";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import RegressionTestRoute from "./routes/RegressionTestRoute";
import { TemplateManager } from "@/components/design/TemplateManager";
import { ErrorBoundary, RoleAwareErrorFallback } from "@/components/errors/ErrorBoundary";

// Create a query client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Important: Use onError for logging but don't handle the error here
      // Let the error propagate to the error boundary
    },
    mutations: {
      retry: 1,
      // Important: Use onError for logging but don't handle the error here
      // Let the error propagate to the error boundary
    },
  },
});

// Protected route wrapper for any authenticated user
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, role } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user && !role) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

// Admin route wrapper
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = useIsAdmin();
  const { user, isLoading } = useAuth();
  
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

// Auth route wrapper (redirects to home if already authenticated)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Designer-specific pages
const DesignerPages = () => (
  <Routes>
    <Route path="/templates" element={<TemplateManager />} />
    <Route path="/design-settings" element={<div>Design Settings (Coming Soon)</div>} />
    <Route path="/layout" element={<div>Layout Editor (Coming Soon)</div>} />
    <Route path="*" element={<Navigate to="/editor" />} />
  </Routes>
);

// Writer-specific pages
const WriterPages = () => (
  <Routes>
    <Route path="/documents" element={<DocumentSelection />} />
    <Route path="/drafts" element={<div>Drafts (Coming Soon)</div>} />
    <Route path="*" element={<Navigate to="/editor" />} />
  </Routes>
);

const AppRoutes = () => (
  <ErrorBoundary context="AppRoutes" fallback={<RoleAwareErrorFallback error={new Error("Application failed to load")} context="application" />}>
    <Routes>
      <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
      <Route path="/" element={<ProtectedRoute><DocumentSelection /></ProtectedRoute>} />
      <Route path="/editor" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/editor/:documentId" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      
      {/* Role-specific routes */}
      <Route path="/design/*" element={<DesignerRoute><DesignerPages /></DesignerRoute>} />
      <Route path="/content/*" element={<WriterRoute><WriterPages /></WriterRoute>} />
      
      {/* Direct template management route */}
      <Route path="/templates" element={<DesignerRoute><TemplateManager /></DesignerRoute>} />
      
      <Route path="/admin" element={<AdminRoute><div>Admin Panel Coming Soon</div></AdminRoute>} />
      <Route path="/testing/regression" element={<RegressionTestRoute />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </ErrorBoundary>
);

function App() {
  return (
    <ErrorBoundary context="App">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
