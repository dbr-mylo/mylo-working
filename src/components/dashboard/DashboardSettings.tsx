
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const DashboardSettings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Settings Tab</CardTitle>
          <CardDescription>This tab will be implemented in Phase 2</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This tab will contain user preferences, notification settings, and account management features.</p>
        </CardContent>
      </Card>
    </div>
  );
};
