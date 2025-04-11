
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSmokeTest } from "@/hooks/useSmokeTest";
import { ErrorBoundary, RoleAwareErrorFallback } from "@/components/errors";
import RouteValidator from "./RouteValidator";
import { 
  ProtectedRoute, 
  AuthRoute, 
  AdminRoute, 
  DesignerRoute, 
  WriterRoute 
} from "./ProtectedRoutes";

// Page imports
import Index from "@/pages/Index";
import DocumentSelection from "@/pages/DocumentSelection";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import HelpSupportPage from "@/pages/HelpSupportPage";

// Route imports
import RegressionTestRoute from "@/routes/RegressionTestRoute";
import SmokeTestRoute from "@/routes/SmokeTestRoute";

// Component imports
import { TemplateManager } from "@/components/design/TemplateManager";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminOverview } from "@/components/admin/pages/AdminOverview";
import { SystemHealthPage } from "@/components/admin/pages/SystemHealthPage";
import { RecoveryMetricsPage } from "@/components/admin/pages/RecoveryMetricsPage";

// Role-specific page components
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

// Main routes component
const AppRoutes = () => {
  useSmokeTest("AppRoutes");
  
  const appErrorFallback = (error: Error, resetErrorBoundary: () => void) => (
    <RoleAwareErrorFallback error={error} context="application" onTryAgain={resetErrorBoundary} />
  );
  
  return (
    <ErrorBoundary context="AppRoutes" fallback={appErrorFallback}>
      <RouteValidator />
      <Routes>
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/documents" element={<ProtectedRoute><DocumentSelection /></ProtectedRoute>} />
        <Route path="/editor" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/editor/:documentId" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><HelpSupportPage /></ProtectedRoute>} />
        
        <Route path="/design/*" element={<DesignerRoute><DesignerPages /></DesignerRoute>} />
        <Route path="/content/*" element={<WriterRoute><WriterPages /></WriterRoute>} />
        
        <Route path="/templates" element={<DesignerRoute><TemplateManager /></DesignerRoute>} />
        
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminOverview />} />
          <Route path="system-health" element={<SystemHealthPage />} />
          <Route path="recovery-metrics" element={<RecoveryMetricsPage />} />
          <Route path="users" element={<div>User Management (Coming Soon)</div>} />
          <Route path="security" element={<div>Security Management (Coming Soon)</div>} />
          <Route path="settings" element={<div>Admin Settings (Coming Soon)</div>} />
        </Route>
        
        <Route path="/testing/regression" element={<RegressionTestRoute />} />
        <Route path="/testing/smoke" element={<SmokeTestRoute />} />
        
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRoutes;
