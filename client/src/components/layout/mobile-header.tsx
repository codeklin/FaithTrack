import { Logo } from "@/components/ui/logo";
import NotificationSystem from "@/components/notification-system";

export default function MobileHeader() {
  return (
    <div className="md:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <Logo size="md" />
        <NotificationSystem />
      </div>
    </div>
  );
}
