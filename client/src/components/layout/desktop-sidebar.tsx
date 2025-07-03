import { Link, useLocation } from "wouter";
import { BarChart3, Calendar, Home, LogOut, TrendingUp, Users } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import NotificationSystem from "@/components/notification-system";

export default function DesktopSidebar() {
  const [location] = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, current: location === '/' },
    { name: 'Members', href: '/members', icon: Users, current: location === '/members', badge: 23 },
    { name: 'Follow-ups', href: '/tasks', icon: Calendar, current: location === '/tasks', badge: 7, notification: true },
    { name: 'Progress', href: '/progress', icon: TrendingUp, current: location === '/progress' },
    { name: 'Reports', href: '/reports', icon: BarChart3, current: location === '/reports' },
  ];

  return (
    <div className="desktop-sidebar fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40 hidden md:block">
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <Logo size="lg" />
          <p className="text-sm text-gray-500 mt-1 ml-13">Faith Journey Tracking</p>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <a className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  item.current 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}>
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className={`text-xs rounded-full px-2 py-1 ml-auto ${
                      item.notification 
                        ? 'bg-amber-600 text-white notification-badge' 
                        : 'bg-green-600 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </a>
              </Link>
            );
          })}
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" 
              alt="Pastor Jide" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Pastor Jide</p>
              <p className="text-xs text-gray-500">Lead Pastor</p>
            </div>
            <div className="flex items-center space-x-2">
              <NotificationSystem />
              <button className="text-gray-400 hover:text-gray-600">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
