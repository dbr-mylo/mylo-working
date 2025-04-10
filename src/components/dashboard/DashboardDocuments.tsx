
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const DashboardDocuments = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Documents</h1>
      <Card>
        <CardHeader>
          <CardTitle>Documents Tab</CardTitle>
          <CardDescription>This tab will be implemented in Phase 2</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This tab will contain a full document management interface with filtering, sorting, and organization features.</p>
        </CardContent>
      </Card>
    </div>
  );
};
