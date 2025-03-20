
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthenticatedRoute, RoleProtectedRoute, DesignerRoute } from "@/components/auth/ProtectedRoutes";
import DocumentSelection from "@/pages/DocumentSelection";
import { AuthImplementationRouter } from "@/components/auth/AuthImplementationRouter";
import { AuthFeatureFlagsProvider } from "@/components/auth/AuthFeatureFlag";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthFeatureFlagsProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={
              <AuthenticatedRoute>
                <DocumentSelection />
              </AuthenticatedRoute>
            } />
            <Route path="/document/:documentId" element={
              <AuthenticatedRoute>
                <Index />
              </AuthenticatedRoute>
            } />
            {/* Designer protected routes */}
            <Route path="/designer" element={
              <DesignerRoute>
                <DocumentSelection />
              </DesignerRoute>
            } />
            <Route path="/designer/:documentId" element={
              <DesignerRoute>
                <Index />
              </DesignerRoute>
            } />
            {/* Add route for /editor - redirects to index page with document ID parameter */}
            <Route path="/editor" element={
              <AuthenticatedRoute>
                <DocumentSelection />
              </AuthenticatedRoute>
            } />
            <Route path="/editor/:documentId" element={
              <AuthenticatedRoute>
                <Index />
              </AuthenticatedRoute>
            } />
            <Route path="/auth" element={<AuthImplementationRouter />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <SonnerToaster position="top-right" />
        </AuthProvider>
      </AuthFeatureFlagsProvider>
    </Router>
  );
}

export default App;
