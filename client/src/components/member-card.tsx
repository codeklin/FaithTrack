import { format } from "date-fns";
import { Trash2, Edit3 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { toDate } from "@/lib/date-utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
// import type { Member } from "@shared/firestore-schema"; // Removed Firebase schema
import { z } from "zod"; // Import Zod

// Define a placeholder schema and type for Member
// This should be replaced with a proper schema based on your Supabase tables
const memberSchema = z.object({
  id: z.string().uuid(), // Assuming member ID is a UUID
  name: z.string(),
  email: z.string().email().optional().nullable(),
  avatar: z.string().url().optional().nullable(),
  convertedDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return undefined;
  }, z.date()), // Assuming convertedDate will always be present
  baptized: z.boolean().optional().default(false),
  inBibleStudy: z.boolean().optional().default(false),
  inSmallGroup: z.boolean().optional().default(false),
  status: z.enum(["new", "contacted", "active", "inactive"]).default("new"), // Add other relevant statuses
  // Add any other fields that are used by this component
});
type Member = z.infer<typeof memberSchema>;

interface MemberCardProps {
  member: Member;
  showDetails?: boolean;
}

export default function MemberCard({ member, showDetails = false }: MemberCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteMemberMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('DELETE', `/api/members/${member.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/members'] });
      queryClient.invalidateQueries({ queryKey: ['/api/members/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Member removed",
        description: `${member.name} has been removed from the system.`,
      });
      setShowDeleteConfirm(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive",
      });
    }
  });

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
    <div className="member-card flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
      <img
        src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
        alt={`${member.name} profile`}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-gray-900">{member.name}</p>
          <span className="text-xs text-gray-500">
            {format(toDate(member.convertedDate), 'MMM d, yyyy')}
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
      
      {showDetails && (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-blue-600"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          
          <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Member</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove {member.name} from the system? This action cannot be undone and will also remove all associated tasks and follow-ups.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMemberMutation.mutate()}
                  disabled={deleteMemberMutation.isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleteMemberMutation.isPending ? 'Removing...' : 'Remove Member'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
