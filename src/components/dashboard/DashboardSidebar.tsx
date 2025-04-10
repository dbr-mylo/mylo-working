
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";
import { 
  Home, 
  FileText, 
  Layout, 
  User, 
  Settings, 
  LogOut,
  HelpCircle,
  Users
} from "lucide-react";
import { isWriterRole, isDesignerRole, isAdminRole } from "@/utils/roles";

export const DashboardSidebar = () => {
  const { user, role, signOut } = useAuth();
  const { navigateTo } = useNavigationHandlers();
  
  return (
    <div className="w-60 border-r border-sidebar-border bg-sidebar h-full overflow-y-auto">
      <div className="py-4 px-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-lg">M</span>
          </div>
          <span className="font-semibold text-xl text-sidebar-foreground">Mylo</span>
        </div>
      </div>
      
      <div className="py-2">
        <div className="px-3 py-1">
          <button 
            onClick={() => navigateTo("/")}
            className="flex items-center w-full px-3 py-2 text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Home className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </button>
        </div>
        
        <div className="px-3 py-1">
          <button 
            onClick={() => navigateTo("/documents")}
            className="flex items-center w-full px-3 py-2 text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <FileText className="h-5 w-5 mr-3" />
            <span>Documents</span>
          </button>
        </div>
        
        {(isDesignerRole(role) || isAdminRole(role)) && (
          <div className="px-3 py-1">
            <button 
              onClick={() => navigateTo("/templates")}
              className="flex items-center w-full px-3 py-2 text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Layout className="h-5 w-5 mr-3" />
              <span>Templates</span>
            </button>
          </div>
        )}
        
        <div className="px-3 py-1">
          <button 
            onClick={() => navigateTo("/profile")}
            className="flex items-center w-full px-3 py-2 text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <User className="h-5 w-5 mr-3" />
            <span>Profile</span>
          </button>
        </div>
        
        {isAdminRole(role) && (
          <div className="px-3 py-1">
            <button 
              onClick={() => navigateTo("/admin")}
              className="flex items-center w-full px-3 py-2 text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Users className="h-5 w-5 mr-3" />
              <span>Admin</span>
            </button>
          </div>
        )}
        
        <div className="px-3 py-1">
          <button 
            onClick={() => navigateTo("/settings")}
            className="flex items-center w-full px-3 py-2 text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Settings className="h-5 w-5 mr-3" />
            <span>Settings</span>
          </button>
        </div>
        
        <div className="px-3 py-1">
          <button 
            onClick={() => navigateTo("/help")}
            className="flex items-center w-full px-3 py-2 text-sidebar-foreground rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <HelpCircle className="h-5 w-5 mr-3" />
            <span>Help & Support</span>
          </button>
        </div>
      </div>
      
      <div className="border-t border-sidebar-border p-4 mt-auto">
        <button 
          onClick={signOut} 
          className="flex items-center w-full px-3 py-2 text-destructive rounded-md hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
