
import React from 'react';
import { FeatureFlagsAdminPanel } from '@/components/admin/FeatureFlagsAdminPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsAdmin } from '@/utils/roles';
import { Navigate } from 'react-router-dom';

export default function AdminFeatureFlagsRoute() {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  
  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feature Flags Administration</h1>
          <p className="text-muted-foreground">
            Manage application features and functionality
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Button>
      </div>
      
      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>Feature Management</CardTitle>
          <CardDescription>
            Control which features are enabled or disabled across the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeatureFlagsAdminPanel />
        </CardContent>
      </Card>
    </div>
  );
}
