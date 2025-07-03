import { format } from "date-fns";
import { CheckCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Task, Member } from "@shared/firestore-schema";
import { toDate } from "@/lib/date-utils";

interface TaskCardProps {
  task: Task;
  showMember?: boolean;
}

export default function TaskCard({ task, showMember = false }: TaskCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: member } = useQuery<Member>({
    queryKey: [`/api/members/${task.memberId}`],
    enabled: showMember && !!task.memberId,
  });

  const completeTaskMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/tasks/${task.id}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/urgent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Task completed",
        description: "The task has been marked as complete.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case 'high': return 'task-priority-high';
      case 'medium': return 'task-priority-medium';
      case 'low': return 'task-priority-low';
      default: return '';
    }
  };

  const isOverdue = toDate(task.dueDate) < new Date() && task.status === 'pending';

  return (
    <div className={`bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors ${getPriorityBorder(task.priority)}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-medium text-gray-900">{task.title}</p>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
          
          {showMember && member && (
            <p className="text-sm text-blue-600 mt-1">Member: {member.name}</p>
          )}
          
          <div className="flex items-center space-x-4 mt-3">
            <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </span>
            <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              Due: {format(toDate(task.dueDate), 'MMM d, yyyy')}
              {isOverdue && ' (Overdue)'}
            </span>
            {task.status === 'completed' && task.completedDate && (
              <span className="text-xs text-green-600">
                Completed: {format(toDate(task.completedDate), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>
        
        {task.status === 'pending' && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              completeTaskMutation.mutate();
            }}
            disabled={completeTaskMutation.isPending}
            className="text-gray-400 hover:text-green-600"
          >
            <CheckCircle className="w-5 h-5" />
          </Button>
        )}
        
        {task.status === 'completed' && (
          <div className="text-green-600">
            <CheckCircle className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
