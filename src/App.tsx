import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/utils/roles";
import { DesignerRoute, WriterRoute } from "@/components/routes/ProtectedRoutes";
import Index from "./pages/Index";
import DocumentSelection from "./pages/DocumentSelection";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
  const { user, isLoading, role } = useAuth();
  const isAdmin = useIsAdmin();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user && !role) {
    return <Navigate to="/auth" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

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

// Designer-specific pages
const DesignerPages = () => (
  <Routes>
    <Route path="/templates" element={<div>Template Management (Coming Soon)</div>} />
    <Route path="/design-settings" element={<div>Design Settings (Coming Soon)</div>} />
    <Route path="/layout" element={<div>Layout Editor (Coming Soon)</div>} />
    <Route path="*" element={<Navigate to="/editor" />} />
  </Routes>
);

// Writer-specific pages
const WriterPages = () => (
  <Routes>
    <Route path="/write" element={<Navigate to="/editor" />} />
    <Route path="/documents" element={<DocumentSelection />} />
    <Route path="/drafts" element={<div>Drafts (Coming Soon)</div>} />
    <Route path="*" element={<Navigate to="/editor" />} />
  </Routes>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
    <Route path="/" element={<ProtectedRoute><DocumentSelection /></ProtectedRoute>} />
    <Route path="/editor" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    <Route path="/editor/:documentId" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    
    {/* Role-specific routes */}
    <Route path="/design/*" element={<ProtectedRoute><DesignerRoute><DesignerPages /></DesignerRoute></ProtectedRoute>} />
    <Route path="/content/*" element={<ProtectedRoute><WriterRoute><WriterPages /></WriterRoute></ProtectedRoute>} />
    
    <Route path="/admin" element={<AdminRoute><div>Admin Panel Coming Soon</div></AdminRoute>} />
    <Route path="/testing/regression" element={<React.lazy(() => import('./routes/RegressionTestRoute'))} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

function App() {
  return (
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
}

export default App;
