
import React from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Wifi, WifiOff } from 'lucide-react';

interface NetworkStatusIndicatorProps {
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'prominent';
  className?: string;
}

export function NetworkStatusIndicator({
  showLabel = false,
  size = 'md',
  variant = 'default',
  className = '',
}: NetworkStatusIndicatorProps) {
  const { isOnline } = useOnlineStatus();
  
  // Define sizes
  const sizeClasses = {
    sm: {
      container: 'text-xs',
      icon: 'h-3 w-3 mr-1',
    },
    md: {
      container: 'text-sm',
      icon: 'h-4 w-4 mr-1.5',
    },
    lg: {
      container: 'text-base',
      icon: 'h-5 w-5 mr-2',
    },
  };
  
  // Define variants
  const variantClasses = {
    default: isOnline 
      ? 'text-green-600' 
      : 'text-amber-600',
    prominent: isOnline
      ? 'bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full'
      : 'bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full',
  };
  
  return (
    <div 
      className={`flex items-center ${sizeClasses[size].container} ${variantClasses[variant]} ${className}`}
    >
      {isOnline ? (
        <Wifi className={sizeClasses[size].icon} />
      ) : (
        <WifiOff className={sizeClasses[size].icon} />
      )}
      {showLabel && (
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      )}
    </div>
  );
}
