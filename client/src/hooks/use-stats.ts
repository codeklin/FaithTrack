import { useQuery } from "@tanstack/react-query";

interface Stats {
  newConverts: number;
  pendingFollowups: number;
  completedTasks: number;
  activeMembers: number;
  baptized: number;
  inBibleStudy: number;
  inSmallGroup: number;
}

export function useStats() {
  return useQuery<Stats>({
    queryKey: ["/api/stats"],
  });
}

export function useStatsWithRefresh() {
  return useQuery<Stats>({
    queryKey: ["/api/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
