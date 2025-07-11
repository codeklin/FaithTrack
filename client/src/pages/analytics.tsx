import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import DesktopSidebar from "@/components/layout/desktop-sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import MobileNavigation from "@/components/layout/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
// import type { Member, Task, Stats } from "@shared/firestore-schema"; // Removed Firebase schema
import { z } from "zod"; // Import Zod
import { Users, UserPlus, Heart, BookOpen, Target } from "lucide-react";

// Define placeholder schemas and types
// These should be replaced with proper schemas based on your Supabase tables
const memberSchema = z.object({
  id: z.string().uuid(),
  // Add other fields if needed by this page
});
type Member = z.infer<typeof memberSchema>;

const taskSchema = z.object({
  id: z.string().uuid(),
  // Add other fields if needed by this page
});
type Task = z.infer<typeof taskSchema>;

const statsSchema = z.object({
  totalMembers: z.number().optional(),
  newConverts: z.number().optional(),
  baptized: z.number().optional(),
  inBibleStudy: z.number().optional(),
  inSmallGroup: z.number().optional(),
  activeMembers: z.number().optional(),
  pendingTasks: z.number().optional(),
  completedTasks: z.number().optional(),
  pendingFollowups: z.number().optional(),
  // Add other stats fields if used
});
type Stats = z.infer<typeof statsSchema>;


export default function Analytics() {
  const { currentUser } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    queryFn: () => apiRequest('GET', '/api/stats'),
    enabled: !!currentUser,
  });

  const { data: members, isLoading: membersLoading } = useQuery<Member[]>({
    queryKey: ["/api/members"],
    queryFn: () => apiRequest('GET', '/api/members'),
    enabled: !!currentUser,
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    queryFn: () => apiRequest('GET', '/api/tasks'),
    enabled: !!currentUser,
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics", timeRange],
    queryFn: () => apiRequest('GET', `/api/analytics?range=${timeRange}`),
    enabled: !!currentUser,
  });

  if (statsLoading || membersLoading || tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Calculate analytics data
  const membersByStatus = [
    { name: 'New Converts', value: stats?.newConverts || 0, color: '#6366F1' },
    { name: 'Baptized', value: stats?.baptized || 0, color: '#8B5CF6' },
    { name: 'Bible Study', value: stats?.inBibleStudy || 0, color: '#EC4899' },
    { name: 'Small Group', value: stats?.inSmallGroup || 0, color: '#F59E0B' },
    { name: 'Active Members', value: stats?.activeMembers || 0, color: '#10B981' },
  ];

  const taskStats = [
    { name: 'Pending', value: stats?.pendingTasks || 0, color: '#F59E0B' },
    { name: 'Completed', value: stats?.completedTasks || 0, color: '#10B981' },
    { name: 'Follow-ups', value: stats?.pendingFollowups || 0, color: '#6366F1' },
  ];

  // Mock growth data - in real app, this would come from API
  const growthData = [
    { month: 'Jan', members: 45, baptisms: 8, tasks: 23 },
    { month: 'Feb', members: 52, baptisms: 12, tasks: 31 },
    { month: 'Mar', members: 61, baptisms: 15, tasks: 28 },
    { month: 'Apr', members: 68, baptisms: 18, tasks: 35 },
    { month: 'May', members: 75, baptisms: 22, tasks: 42 },
    { month: 'Jun', members: 83, baptisms: 25, tasks: 38 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopSidebar />
      <MobileHeader />
      
      <div className="lg:pl-64">
        <div className="p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Comprehensive insights into your faith community</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Button
                variant={timeRange === '7d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('7d')}
              >
                7 Days
              </Button>
              <Button
                variant={timeRange === '30d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('30d')}
              >
                30 Days
              </Button>
              <Button
                variant={timeRange === '90d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('90d')}
              >
                90 Days
              </Button>
              <Button
                variant={timeRange === '1y' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('1y')}
              >
                1 Year
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="growth">Growth</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Members</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalMembers || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Badge variant="secondary" className="text-green-600 bg-green-100">
                        +12% this month
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">New Converts</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.newConverts || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <UserPlus className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Badge variant="secondary" className="text-green-600 bg-green-100">
                        +5 this week
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Baptized</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.baptized || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Heart className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Badge variant="secondary" className="text-green-600 bg-green-100">
                        +3 this month
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Bible Study</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.inBibleStudy || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Badge variant="secondary" className="text-green-600 bg-green-100">
                        +8 this month
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                        <p className="text-2xl font-bold text-gray-900">85%</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Badge variant="secondary" className="text-green-600 bg-green-100">
                        +5% this month
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="growth" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Growth Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Growth trends data is currently unavailable.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <MobileNavigation activeTab="analytics" />
    </div>
  );
}
