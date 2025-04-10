
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
    <div className="w-60 border-r border-gray-200 bg-white h-full overflow-y-auto">
      <div className="py-4 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="font-semibold text-xl">Mylo</span>
        </div>
      </div>
      
      <div className="py-2">
        <div className="px-3 py-1">
          <button 
            onClick={() => navigateTo("/")}
            className="flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
          >
            <Home className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </button>
        </div>
        
        <div className="px-3 py-1">
          <button 
            onClick={() => navigateTo("/documents")}
            className="flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
          >
            <FileText className="h-5 w-5 mr-3" />
            <span>Documents</span>
          </button>
        </div>
        
        {(isDesignerRole(role) || isAdminRole(role)) && (
          <div className="px-3 py-1">
            <button 
              onClick={() => navigateTo("/templates")}
              className="flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
            >
              <Layout className="h-5 w-5 mr-3" />
              <span>Templates</span>
            </button>
          </div>
        )}
        
        <div className="px-3 py-1">
          <button 
            onClick={() => navigateTo("/profile")}
            className="flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
          >
            <User className="h-5 w-5 mr-3" />
            <span>Profile</span>
          </button>
        </div>
        
        {isAdminRole(role) && (
          <div className="px-3 py-1">
            <button 
              onClick={() => navigateTo("/admin")}
              className="flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
            >
              <Users className="h-5 w-5 mr-3" />
              <span>Admin</span>
            </button>
          </div>
        )}
        
        <div className="px-3 py-1">
          <button 
            onClick={() => navigateTo("/settings")}
            className="flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
          >
            <Settings className="h-5 w-5 mr-3" />
            <span>Settings</span>
          </button>
        </div>
        
        <div className="px-3 py-1">
          <button 
            onClick={() => navigateTo("/help")}
            className="flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
          >
            <HelpCircle className="h-5 w-5 mr-3" />
            <span>Help & Support</span>
          </button>
        </div>
      </div>
      
      <div className="border-t border-gray-200 p-4 mt-auto">
        <button 
          onClick={signOut} 
          className="flex items-center w-full px-3 py-2 text-red-600 rounded-md hover:bg-red-50"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
