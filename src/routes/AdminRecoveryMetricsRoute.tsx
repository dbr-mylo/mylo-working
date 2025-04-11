
import React from 'react';
import { RecoveryMetricsDashboard } from '@/components/admin/RecoveryMetricsDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsAdmin } from '@/utils/roles';
import { Navigate } from 'react-router-dom';
import { resetErrorAnalytics, clearErrorHistory } from '@/utils/error/selfHealingSystem';
import { toast } from 'sonner';

export default function AdminRecoveryMetricsRoute() {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  
  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  const handleResetAnalytics = () => {
    resetErrorAnalytics();
    clearErrorHistory();
    toast.success('Error analytics data cleared', {
      description: 'All error tracking data has been reset.'
    });
  };
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recovery Metrics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor error recovery performance and system resilience
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="destructive" 
            onClick={handleResetAnalytics}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Data
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>System Recovery Performance</CardTitle>
          <CardDescription>
            Track automated error recovery metrics and improvement opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecoveryMetricsDashboard />
        </CardContent>
      </Card>
    </div>
  );
}
