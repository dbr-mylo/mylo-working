
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavigationTestDashboard from '@/components/testing/NavigationTestDashboard';
import { AdminRoute } from './ProtectedRoutes';

/**
 * Routes for testing components and tools
 * These are only available to admin users
 */
export const TestingRoutes = () => {
  return (
    <Routes>
      <Route path="/navigation" element={
        <AdminRoute>
          <NavigationTestDashboard />
        </AdminRoute>
      } />
    </Routes>
  );
};

export default TestingRoutes;
