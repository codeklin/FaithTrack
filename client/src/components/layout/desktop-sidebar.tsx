import { Link, useLocation } from "wouter";
import { BarChart3, Calendar, Home, LogOut, TrendingUp, Users } from "lucide-react";

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
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FaithTrack</h1>
              <p className="text-sm text-gray-500">Member Care System</p>
            </div>
          </div>
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
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" 
              alt="Pastor John Smith" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Pastor John Smith</p>
              <p className="text-xs text-gray-500">Lead Pastor</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
