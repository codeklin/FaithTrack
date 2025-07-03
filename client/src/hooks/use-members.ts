import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { Member, InsertMember } from "@shared/firestore-schema";

export function useMembers() {
  return useQuery<Member[]>({
    queryKey: ["/api/members"],
  });
}

export function useMember(id: number) {
  return useQuery<Member>({
    queryKey: [`/api/members/${id}`],
    enabled: !!id,
  });
}

export function useRecentMembers(limit = 5) {
  return useQuery<Member[]>({
    queryKey: ["/api/members/recent", limit],
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InsertMember) => {
      return apiRequest('POST', '/api/members', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/members'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });
}

export function useUpdateMember(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<InsertMember>) => {
      return apiRequest('PUT', `/api/members/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/members'] });
      queryClient.invalidateQueries({ queryKey: [`/api/members/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });
}

export function useDeleteMember(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiRequest('DELETE', `/api/members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/members'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });
}
