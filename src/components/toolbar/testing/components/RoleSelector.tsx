
import React from 'react';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, setSelectedRole }) => {
  const { role, continueAsGuestWriter, continueAsGuestDesigner, continueAsGuestAdmin, continueAsGuestEditor } = useAuth();
  const { toast } = useToast();
  
  const changeTestingRole = (newRole: UserRole) => {
    setSelectedRole(newRole);
    
    switch(newRole) {
      case 'writer':
        continueAsGuestWriter();
        break;
      case 'designer':
        continueAsGuestDesigner();
        break;
      case 'admin':
        continueAsGuestAdmin();
        break;
      case 'editor':
        continueAsGuestEditor();
        break;
    }
    
    toast({
      title: `Role Changed`,
      description: `Testing with ${newRole} role`,
      duration: 3000,
    });
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">Current Role:</span>
        <Badge className="text-sm font-medium">
          {role || 'No Role'}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Change Role for Testing:</span>
        <Select
          value={selectedRole || undefined}
          onValueChange={(value) => changeTestingRole(value as UserRole)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="writer">Writer</SelectItem>
            <SelectItem value="designer">Designer</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor (Legacy)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
