
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/utils/roles";
import { AuthenticatedRoute, RoleProtectedRoute, AdminRoute } from "@/components/auth/ProtectedRoutes";
import Index from "./pages/Index";
import DocumentSelection from "./pages/DocumentSelection";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Auth route wrapper (redirects to home if already authenticated)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, role } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (user || role) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
    
    {/* Protected routes that require authentication */}
    <Route element={<AuthenticatedRoute />}>
      <Route path="/" element={<DocumentSelection />} />
      <Route path="/editor" element={<Index />} />
      <Route path="/editor/:documentId" element={<Index />} />
    </Route>
    
    {/* Designer-only routes */}
    <Route element={<RoleProtectedRoute requiredRoles={['designer']} />}>
      {/* Add designer-specific routes here */}
    </Route>
    
    {/* Editor-only routes */}
    <Route element={<RoleProtectedRoute requiredRoles={['editor']} />}>
      {/* Add editor-specific routes here */}
    </Route>
    
    {/* Admin-only routes */}
    <Route element={<AdminRoute />}>
      <Route path="/admin" element={<div>Admin Panel Coming Soon</div>} />
    </Route>
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
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
);

export default App;
