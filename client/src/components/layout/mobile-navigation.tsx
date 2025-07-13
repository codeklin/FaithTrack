import { Link } from "wouter";
import { BarChart3, Calendar, Home, TrendingUp, Users } from "lucide-react";

interface MobileNavigationProps {
  activeTab: string;
}

export default function MobileNavigation({ activeTab }: MobileNavigationProps) {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, id: 'dashboard' },
    { name: 'Members', href: '/members', icon: Users, id: 'members', badge: 23 },
    { name: 'Tasks', href: '/tasks', icon: Calendar, id: 'tasks', badge: 7, notification: true },
    { name: 'Progress', href: '/progress', icon: TrendingUp, id: 'progress' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, id: 'analytics' },
  ];

  return (
    <nav className="mobile-nav md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-around">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Link key={item.name} href={item.href} className={`flex flex-col items-center space-y-1 p-2 relative ${
              isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
            }`}>
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.name}</span>
              {item.badge && (
                <span className={`absolute -top-1 -right-1 text-xs rounded-full w-5 h-5 flex items-center justify-center ${
                  item.notification
                    ? 'bg-amber-600 text-white notification-badge'
                    : 'bg-green-600 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
