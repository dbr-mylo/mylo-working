
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useNavigationHandlers } from "@/hooks/navigation/useNavigationHandlers";
import { 
  Home, 
  FileText, 
  Layout, 
  User, 
  Settings, 
  LogOut,
  MessageSquare,
  Users,
  HelpCircle
} from "lucide-react";
import { isWriterRole, isDesignerRole, isAdminRole } from "@/utils/roles";

export const DashboardSidebar = () => {
  const { user, role, signOut } = useAuth();
  const { navigateTo } = useNavigationHandlers();
  
  return (
    <Sidebar variant="sidebar" className="border-r border-gray-200 bg-white">
      <SidebarHeader className="py-4 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="font-semibold text-xl">Mylo</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigateTo("/")} tooltip="Dashboard">
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigateTo("/content/documents")} tooltip="Documents">
              <FileText className="h-5 w-5" />
              <span>Documents</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {(isDesignerRole(role) || isAdminRole(role)) && (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigateTo("/design/templates")} tooltip="Templates">
                <Layout className="h-5 w-5" />
                <span>Templates</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigateTo("/profile")} tooltip="Profile">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {isAdminRole(role) && (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigateTo("/admin")} tooltip="Admin">
                <Users className="h-5 w-5" />
                <span>Admin</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigateTo("/settings")} tooltip="Settings">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigateTo("/help")} tooltip="Help & Support">
              <HelpCircle className="h-5 w-5" />
              <span>Help & Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-200 p-4">
        <SidebarMenuButton onClick={signOut} variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};
