import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export default function StatsCard({ title, value, subtitle, icon: Icon, iconColor, iconBg }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm text-green-600 font-medium">{subtitle}</span>
      </div>
    </div>
  );
}
