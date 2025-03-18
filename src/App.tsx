
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoutes } from "@/components/auth/ProtectedRoutes";
import DocumentSelection from "@/pages/DocumentSelection";
import { AuthImplementationRouter } from "@/components/auth/AuthImplementationRouter";
import { AuthFeatureFlagsProvider, AuthToggle } from "@/components/auth/AuthFeatureFlag";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthFeatureFlagsProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={
              <ProtectedRoutes>
                <DocumentSelection />
              </ProtectedRoutes>
            } />
            <Route path="/auth" element={<AuthImplementationRouter />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <SonnerToaster position="top-right" />
          <AuthToggle />
        </AuthProvider>
      </AuthFeatureFlagsProvider>
    </Router>
  );
}

export default App;
