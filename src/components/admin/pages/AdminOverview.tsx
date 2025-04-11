
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart, Users, Shield, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const AdminOverview = () => {
  const navigate = useNavigate();
  
  const adminModules = [
    {
      title: "System Health",
      description: "Monitor system health and manage feature flags",
      icon: Activity,
      path: "/admin/system-health",
      color: "text-green-500"
    },
    {
      title: "Recovery Metrics",
      description: "View error recovery statistics and performance",
      icon: BarChart,
      path: "/admin/recovery-metrics",
      color: "text-blue-500"
    },
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      path: "/admin/users",
      color: "text-amber-500"
    },
    {
      title: "Security",
      description: "Configure security settings and audit logs",
      icon: Shield,
      path: "/admin/security",
      color: "text-red-500"
    },
    {
      title: "Settings",
      description: "Configure global application settings",
      icon: Settings,
      path: "/admin/settings",
      color: "text-purple-500"
    }
  ];
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module) => (
          <Card key={module.title} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <module.icon className={`h-5 w-5 ${module.color}`} />
                {module.title}
              </CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(module.path)}
              >
                Access {module.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
