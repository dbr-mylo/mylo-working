
import React from "react";
import { useTestGuestRoleImplementation } from "@/hooks/auth/useTestGuestRoleImplementation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/lib/types";

/**
 * Test component to verify the improved guest role functionality
 * This allows us to test the new implementation before replacing the original
 */
export const TestGuestRoleComponent = () => {
  const { role, expirationInfo, setRole, clearRole } = useTestGuestRoleImplementation();
  
  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Test Guest Role Implementation</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Current Role:</h3>
          <p className="text-lg">{role ? role.charAt(0).toUpperCase() + role.slice(1) : "None"}</p>
        </div>
        
        {expirationInfo && (
          <div>
            <h3 className="font-medium">Role Expiration:</h3>
            <p className={expirationInfo.isExpired ? "text-red-500" : "text-green-500"}>
              {expirationInfo.isExpired ? "Expired" : expirationInfo.formattedTime + " remaining"}
            </p>
            <p className="text-sm text-gray-500">
              Expires at: {new Date(expirationInfo.expiresAt).toLocaleString()}
            </p>
          </div>
        )}
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="font-medium">Set Guest Role:</h3>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleSetRole("editor")} variant="outline">
              Continue as Editor
            </Button>
            <Button onClick={() => handleSetRole("designer")} variant="outline">
              Continue as Designer
            </Button>
            <Button onClick={() => handleSetRole("admin")} variant="outline">
              Continue as Admin
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button onClick={clearRole} variant="destructive" className="w-full">
          Clear Guest Role
        </Button>
      </CardFooter>
    </Card>
  );
};
