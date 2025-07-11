import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
// import type { Member, InsertMember } from "@shared/firestore-schema"; // Removed Firebase schema
import { z } from "zod"; // Import Zod

// Define placeholder schemas and types
// These should be replaced with proper schemas based on your Supabase tables
const memberSchema = z.object({
  id: z.string().uuid(), // Assuming member ID is a UUID
  name: z.string(),
  email: z.string().email().optional().nullable(),
  // Add any other fields that are frequently accessed or needed for list views/previews
  status: z.enum(["new", "contacted", "active", "inactive"]).optional(),
  convertedDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return undefined;
  }, z.date().optional()),
});
type Member = z.infer<typeof memberSchema>;

// This is the schema for creating/inserting a member.
// It might be different from the Member schema (e.g., 'id' might be auto-generated).
const insertMemberSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  assignedStaff: z.string().optional(),
  status: z.enum(["new", "contacted", "active", "inactive"]).default("new"),
  avatar: z.string().url().optional().or(z.literal('')),
  membershipStatus: z.enum(["pending", "member", "former"]).default("pending"),
  convertedDate: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
    return undefined;
  }, z.date().optional()),
  baptized: z.boolean().default(false),
  inBibleStudy: z.boolean().default(false),
  inSmallGroup: z.boolean().default(false),
});
type InsertMember = z.infer<typeof insertMemberSchema>;


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
