import React from "react";
import { 
  FileText, 
  Pencil, 
  Layout, 
  Settings, 
  Box, 
  TestTube2, 
  Home, 
  Clock, 
  FileCode, 
  FolderOpen, 
  Activity,
  BarChart
} from "lucide-react";
import { NavItemConfig } from "./NavigationItem";

// Common navigation items for all roles
export const commonNavItems: NavItemConfig[] = [
  { href: "/", label: "Dashboard", icon: <Home className="h-4 w-4 mr-2" /> },
];

// Writer-specific navigation items
export const writerNavItems: NavItemConfig[] = [
  { href: "/writer-dashboard", label: "Writer Dashboard", icon: <Home className="h-4 w-4 mr-2" /> },
  { href: "/editor", label: "Editor", icon: <Pencil className="h-4 w-4 mr-2" /> },
  { href: "/content/drafts", label: "Drafts", icon: <Box className="h-4 w-4 mr-2" /> },
];

// Designer-specific navigation items
export const designerNavItems: NavItemConfig[] = [
  { href: "/designer-dashboard", label: "Designer Dashboard", icon: <Home className="h-4 w-4 mr-2" /> },
  { href: "/templates", label: "Templates", icon: <FileCode className="h-4 w-4 mr-2" /> },
  { href: "/design/layout", label: "Layout", icon: <Layout className="h-4 w-4 mr-2" /> },
];

// Admin-specific navigation items
export const adminNavItems: NavItemConfig[] = [
  { href: "/admin-dashboard", label: "Admin Dashboard", icon: <Home className="h-4 w-4 mr-2" /> },
  { href: "/admin/system-health", label: "System Health", icon: <Activity className="h-4 w-4 mr-2" /> },
  { href: "/admin/recovery-metrics", label: "Recovery Metrics", icon: <BarChart className="h-4 w-4 mr-2" /> },
];

// Testing navigation items
export const testingNavItems: NavItemConfig[] = [
  { href: "/testing/regression", label: "Regression Tests", icon: <TestTube2 className="h-4 w-4 mr-2" /> },
  { href: "/testing/smoke", label: "Smoke Tests", icon: <TestTube2 className="h-4 w-4 mr-2" /> }
];
