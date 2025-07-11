import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import DesktopSidebar from "@/components/layout/desktop-sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import MobileNavigation from "@/components/layout/mobile-navigation";
import StatsCard from "@/components/stats-card";
import MemberCard from "@/components/member-card";
import TaskCard from "@/components/task-card";
import AddMemberDialog from "@/components/dialogs/add-member-dialog";
import AddTaskDialog from "@/components/dialogs/add-task-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Calendar, CheckCircle, Send, BarChart3, Users, UserPlus, Clock, TrendingUp } from "lucide-react";
// import type { Member, Task, Stats } from "@shared/firestore-schema"; // Removed Firebase schema
import { z } from "zod"; // Import Zod

// Define placeholder schemas and types
// These should be replaced with proper schemas based on your Supabase tables
const memberSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email().optional().nullable(),
  avatar: z.string().url().optional().nullable(),
  convertedDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return undefined;
  }, z.date()),
  baptized: z.boolean().optional().default(false),
  inBibleStudy: z.boolean().optional().default(false),
  inSmallGroup: z.boolean().optional().default(false),
  status: z.enum(["new", "contacted", "active", "inactive"]).default("new"),
});
type Member = z.infer<typeof memberSchema>;

const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional().nullable(),
  memberId: z.string().uuid().optional().nullable(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  dueDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return undefined;
  }, z.date()),
  completedDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return undefined;
  }, z.date().optional().nullable()),
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
});
type Stats = z.infer<typeof statsSchema>;


export default function Dashboard() {
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const { currentUser } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    queryFn: () => apiRequest('GET', '/api/stats'),
    enabled: !!currentUser,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  const { data: recentMembers, isLoading: membersLoading } = useQuery<Member[]>({
    queryKey: ["/api/members/recent"],
    queryFn: () => apiRequest('GET', '/api/members/recent'),
    enabled: !!currentUser,
  });

  const { data: urgentTasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks/urgent"],
    queryFn: () => apiRequest('GET', '/api/tasks/urgent'),
    enabled: !!currentUser,
  });

  if (statsLoading || membersLoading || tasksLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopSidebar />
      <MobileHeader />
      
      <main className="md:ml-64 pb-20 md:pb-0">
        <div className="p-4 md:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-gray-600 mt-1">Welcome back, Pastor Jide. Here's what's happening with your congregation.</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button onClick={() => setShowAddMember(true)} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add New Member
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="New Converts"
              value={stats?.newConverts || 0}
              subtitle="This week"
              icon={Users}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
              trend={{
                value: 25,
                isPositive: true,
                period: "vs last week"
              }}
              isLoading={statsLoading}
            />
            <StatsCard
              title="Pending Follow-ups"
              value={stats?.pendingFollowups || 0}
              subtitle="Need attention"
              icon={Clock}
              iconColor="text-amber-600"
              iconBg="bg-amber-100"
              trend={{
                value: 15,
                isPositive: false,
                period: "vs last week"
              }}
              isLoading={statsLoading}
            />
            <StatsCard
              title="Completed This Month"
              value={stats?.completedTasks || 0}
              subtitle="Task completion"
              icon={CheckCircle}
              iconColor="text-green-600"
              iconBg="bg-green-100"
              trend={{
                value: 12,
                isPositive: true,
                period: "vs last month"
              }}
              isLoading={statsLoading}
            />
            <StatsCard
              title="Active Members"
              value={stats?.activeMembers || 0}
              subtitle="Community growth"
              icon={TrendingUp}
              iconColor="text-purple-600"
              iconBg="bg-purple-100"
              trend={{
                value: 18,
                isPositive: true,
                period: "this quarter"
              }}
              isLoading={statsLoading}
            />
          </div>

          {/* Recent Converts & Urgent Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Converts Section */}
            <Card>
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Converts</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {recentMembers?.length ? (
                  recentMembers.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent converts found</p>
                )}
              </CardContent>
            </Card>

            {/* Urgent Tasks Section */}
            <Card>
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">Urgent Follow-ups</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {urgentTasks?.length ? (
                  urgentTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No urgent tasks found</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Progress Tracking */}
          <Card className="mb-8">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-900">Spiritual Journey Progress</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Track member progression through key milestones</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <UserPlus className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">Salvation</h4>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{stats?.newConverts || 0}</p>
                  <p className="text-sm text-gray-600">New Converts</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">Baptism</h4>
                  <p className="text-2xl font-bold text-green-600 mt-2">{stats?.baptized || 0}</p>
                  <p className="text-sm text-gray-600">Baptized</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="w-8 h-8 text-amber-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">Bible Study</h4>
                  <p className="text-2xl font-bold text-amber-600 mt-2">{stats?.inBibleStudy || 0}</p>
                  <p className="text-sm text-gray-600">Enrolled</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">Small Groups</h4>
                  <p className="text-2xl font-bold text-indigo-600 mt-2">{stats?.inSmallGroup || 0}</p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 h-auto justify-start"
                  onClick={() => setShowAddTask(true)}
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Schedule Follow-up</p>
                    <p className="text-sm text-gray-600">Set reminders for member visits</p>
                  </div>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 h-auto justify-start"
                >
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Generate Report</p>
                    <p className="text-sm text-gray-600">Monthly progress summaries</p>
                  </div>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-3 p-4 bg-amber-50 hover:bg-amber-100 h-auto justify-start"
                >
                  <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Send Reminders</p>
                    <p className="text-sm text-gray-600">Bulk notification to staff</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <MobileNavigation activeTab="dashboard" />
      
      <AddMemberDialog open={showAddMember} onOpenChange={setShowAddMember} />
      <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} />
    </div>
  );
}
