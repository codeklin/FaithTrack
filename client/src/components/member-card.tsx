import { format } from "date-fns";
import type { Member } from "@shared/schema";

interface MemberCardProps {
  member: Member;
  showDetails?: boolean;
}

export default function MemberCard({ member, showDetails = false }: MemberCardProps) {
  const getNextFollowUpText = (member: Member) => {
    if (member.status === 'new') return 'Next follow-up: Tomorrow';
    if (member.status === 'contacted') return 'Follow-up overdue';
    return 'Next follow-up: Friday';
  };

  const getStatusDot = (member: Member) => {
    if (member.status === 'active') return 'bg-green-500';
    if (member.status === 'contacted') return 'bg-amber-500';
    return 'bg-gray-500';
  };

  return (
    <div className="member-card flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-all">
      <img
        src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
        alt={`${member.name} profile`}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-gray-900">{member.name}</p>
          <span className="text-xs text-gray-500">
            {format(new Date(member.convertedDate), 'MMM d, yyyy')}
          </span>
        </div>
        
        {showDetails && member.email && (
          <p className="text-sm text-gray-600">{member.email}</p>
        )}
        
        <p className="text-sm text-gray-600">
          {member.baptized ? 'Baptized' : member.inBibleStudy ? 'Bible study enrolled' : 'Baptism scheduled'}
        </p>
        
        <div className="flex items-center space-x-2 mt-2">
          <div className={`w-2 h-2 rounded-full ${getStatusDot(member)}`}></div>
          <span className="text-xs text-gray-500">{getNextFollowUpText(member)}</span>
        </div>
        
        {showDetails && (
          <div className="flex items-center space-x-4 mt-3">
            <div className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full ${member.baptized ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-xs text-gray-600">Baptized</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full ${member.inBibleStudy ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <span className="text-xs text-gray-600">Bible Study</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full ${member.inSmallGroup ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
              <span className="text-xs text-gray-600">Small Group</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
