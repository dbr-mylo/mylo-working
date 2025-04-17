
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavigationTestDashboard from '@/components/testing/NavigationTestDashboard';
import { AdminRoute } from './ProtectedRoutes';
import { ParameterTestingSuite } from '@/components/toolbar/testing/parameters/ParameterTestingSuite';
import { ToolbarTester } from '@/components/toolbar/testing/ToolbarTester';

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
      <Route path="/parameters" element={
        <AdminRoute>
          <ParameterTestingSuite />
        </AdminRoute>
      } />
      <Route path="/toolbar" element={
        <AdminRoute>
          <ToolbarTester />
        </AdminRoute>
      } />
    </Routes>
  );
};

export default TestingRoutes;
