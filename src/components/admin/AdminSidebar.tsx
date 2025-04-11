
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, 
  BarChart, 
  Settings, 
  Users, 
  Shield,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Admin Sidebar component providing navigation for admin-specific pages
 */
export const AdminSidebar = () => {
  const navItems = [
    { to: "/admin", label: "Overview", icon: Home, end: true },
    { to: "/admin/system-health", label: "System Health", icon: Activity },
    { to: "/admin/recovery-metrics", label: "Recovery Metrics", icon: BarChart },
    { to: "/admin/users", label: "User Management", icon: Users },
    { to: "/admin/security", label: "Security", icon: Shield },
    { to: "/admin/settings", label: "Settings", icon: Settings }
  ];
  
  return (
    <div className="w-64 bg-sidebar border-r border-border h-full overflow-y-auto">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) => 
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
