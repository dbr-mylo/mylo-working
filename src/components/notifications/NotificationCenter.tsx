
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useNotifications, Notification } from '@/contexts/notifications/NotificationsContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
  } = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.link) {
      navigate(notification.link);
    } else if (notification.entityType && notification.entityId) {
      // Handle navigation based on entity type
      switch (notification.entityType) {
        case 'document':
          navigate(`/editor/${notification.entityId}`);
          break;
        case 'project':
          navigate(`/dashboard?project=${notification.entityId}`);
          break;
        case 'template':
          navigate(`/templates/${notification.entityId}`);
          break;
        default:
          break;
      }
    }
    
    setOpen(false);
  };
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />;
      case 'warning':
        return <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />;
      case 'error':
        return <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />;
      default:
        return <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />;
    }
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[350px]">
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead} 
              disabled={unreadCount === 0}
              className="text-xs h-7"
            >
              Mark all read
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
              className="text-xs h-7"
            >
              Clear all
            </Button>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500 text-sm">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={`px-4 py-3 cursor-pointer ${!notification.read ? 'bg-gray-50' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{notification.title}</div>
                    <div className="text-gray-600 text-xs mt-1">{notification.message}</div>
                    <div className="text-gray-400 text-xs mt-2">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
