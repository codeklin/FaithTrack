import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
// import type { Task } from "@shared/firestore-schema"; // Removed Firebase schema
import { z } from "zod"; // Import Zod
import { toDate } from "@/lib/date-utils";

// Define a placeholder schema and type for Task
// This should be replaced with a proper schema based on your Supabase tables
const taskSchema = z.object({
  id: z.string().uuid(), // Assuming task ID is a UUID
  title: z.string(),
  dueDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return undefined;
  }, z.date()), // Assuming dueDate will always be present
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]), // Add other relevant statuses
  // Add any other fields that are used by this component (e.g., priority if it affects notification type)
});
type Task = z.infer<typeof taskSchema>;

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'urgent' | 'info';
  timestamp: Date;
  taskId?: string;
  isRead: boolean;
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  const { data: urgentTasks } = useQuery<Task[]>({
    queryKey: ["/api/tasks/urgent"],
    refetchInterval: 30000, // Check every 30 seconds
  });

  const { data: pendingTasks } = useQuery<Task[]>({
    queryKey: ["/api/tasks/pending"],
    refetchInterval: 60000, // Check every minute
  });

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(setPermission);
      }
    }
  }, []);

  // Check for overdue tasks and create notifications
  useEffect(() => {
    if (!urgentTasks && !pendingTasks) return;

    const now = new Date();
    const allTasks = [...(urgentTasks || []), ...(pendingTasks || [])];
    
    allTasks.forEach(task => {
      const dueDate = toDate(task.dueDate);
      const timeDiff = dueDate.getTime() - now.getTime();
      const hoursUntilDue = timeDiff / (1000 * 60 * 60);
      
      // Create notification for overdue tasks
      if (timeDiff < 0 && task.status === 'pending') {
        const notificationId = `overdue-${task.id}`;
        const existingNotification = notifications.find(n => n.id === notificationId);
        
        if (!existingNotification) {
          createNotification({
            id: notificationId,
            title: 'Overdue Task',
            message: `"${task.title}" is overdue!`,
            type: 'urgent',
            timestamp: now,
            taskId: task.id,
            isRead: false
          });
        }
      }
      
      // Create notification for tasks due within 2 hours
      else if (hoursUntilDue > 0 && hoursUntilDue <= 2 && task.status === 'pending') {
        const notificationId = `due-soon-${task.id}`;
        const existingNotification = notifications.find(n => n.id === notificationId);
        
        if (!existingNotification) {
          createNotification({
            id: notificationId,
            title: 'Task Due Soon',
            message: `"${task.title}" is due in ${Math.round(hoursUntilDue)} hour(s)`,
            type: 'reminder',
            timestamp: now,
            taskId: task.id,
            isRead: false
          });
        }
      }
    });
  }, [urgentTasks, pendingTasks, notifications]);

  const createNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep only 10 most recent
    
    // Show browser notification if permission granted
    if (permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.type === 'urgent'
      });
    }
    
    // Play notification sound for urgent notifications
    if (notification.type === 'urgent') {
      playNotificationSound();
    }
  };

  const playNotificationSound = () => {
    try {
      // Create audio context for notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const hasUrgentNotifications = notifications.some(n => !n.isRead && n.type === 'urgent');

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 border-red-300 text-red-800';
      case 'reminder': return 'bg-amber-100 border-amber-300 text-amber-800';
      default: return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2"
      >
        <Bell className={`w-5 h-5 ${hasUrgentNotifications ? 'notification-bell-urgent' : ''}`} />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs notification-badge"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <div className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Notifications</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className={`text-xs px-2 py-1 rounded ${getNotificationColor(notification.type)}`}>
                          {notification.type.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {format(notification.timestamp, 'MMM d, HH:mm')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notification.id);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No notifications</p>
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotifications([])}
                className="w-full text-gray-600 hover:text-gray-800"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}