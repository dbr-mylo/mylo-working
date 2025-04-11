
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

const ProfilePage = () => {
  const { user, role } = useAuth();
  
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      
      <div className="flex-1 p-8 bg-background overflow-auto">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>
        
        <div className="max-w-2xl">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user?.name || "User"}</CardTitle>
                <CardDescription>Role: {role || "No role assigned"}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <h3 className="font-medium text-sm">Email</h3>
                  <p className="text-muted-foreground">{user?.email || "No email provided"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Account Created</h3>
                  <p className="text-muted-foreground">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString() 
                      : "Unknown"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Last Login</h3>
                  <p className="text-muted-foreground">
                    {user?.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString() 
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
