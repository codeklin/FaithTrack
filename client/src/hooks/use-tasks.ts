import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
// import type { Task, InsertTask } from "@shared/firestore-schema"; // Removed Firebase-related import

// Define generic types for Task and InsertTask, or replace with Supabase-specific types
interface Task {
  id: number;
  user_id: string;
  task: string;
  is_complete: boolean;
  created_at: string;
}

interface InsertTask {
  user_id: string;
  task: string;
  is_complete?: boolean;
}

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });
}

export function useTask(id: number) {
  return useQuery<Task>({
    queryKey: [`/api/tasks/${id}`],
    enabled: !!id,
  });
}

export function useUrgentTasks() {
  return useQuery<Task[]>({
    queryKey: ["/api/tasks/urgent"],
  });
}

export function usePendingTasks() {
  return useQuery<Task[]>({
    queryKey: ["/api/tasks/pending"],
  });
}

export function useTasksByMember(memberId: number) {
  return useQuery<Task[]>({
    queryKey: ["/api/tasks/member", memberId],
    enabled: !!memberId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InsertTask) => {
      return apiRequest('POST', '/api/tasks', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/urgent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });
}

export function useUpdateTask(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<InsertTask>) => {
      return apiRequest('PUT', `/api/tasks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: [`/api/tasks/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/urgent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('POST', `/api/tasks/${id}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/urgent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/urgent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });
}
