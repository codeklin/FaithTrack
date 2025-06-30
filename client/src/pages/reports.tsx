import { useQuery } from "@tanstack/react-query";
import { Loader2, Download, Calendar, BarChart3, Users, TrendingUp } from "lucide-react";
import DesktopSidebar from "@/components/layout/desktop-sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import MobileNavigation from "@/components/layout/mobile-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function Reports() {
  const [reportPeriod, setReportPeriod] = useState("monthly");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["/api/members"],
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["/api/tasks"],
  });

  if (isLoading || membersLoading || tasksLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const generateReport = () => {
    const reportData = {
      period: reportPeriod,
      stats,
      totalMembers: members?.length || 0,
      totalTasks: tasks?.length || 0,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faith-track-report-${reportPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Reports & Analytics</h2>
                <p className="text-gray-600 mt-1">Generate insights about your congregation's spiritual growth.</p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <Select value={reportPeriod} onValueChange={setReportPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={generateReport} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Members</p>
                    <p className="text-2xl font-bold text-gray-900">{members?.length || 0}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Baptism Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {members?.length ? Math.round(((stats?.baptized || 0) / members.length) * 100) : 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {tasks?.length ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}%
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Follow-ups</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.pendingFollowups || 0}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Member Growth Report */}
            <Card>
              <CardHeader>
                <CardTitle>Member Growth Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">New Converts</span>
                    <span className="font-bold text-blue-600">{stats?.newConverts || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Baptized Members</span>
                    <span className="font-bold text-green-600">{stats?.baptized || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Bible Study Participants</span>
                    <span className="font-bold text-amber-600">{stats?.inBibleStudy || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Small Group Members</span>
                    <span className="font-bold text-indigo-600">{stats?.inSmallGroup || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task Performance Report */}
            <Card>
              <CardHeader>
                <CardTitle>Task Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Total Tasks</span>
                    <span className="font-bold">{tasks?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Completed Tasks</span>
                    <span className="font-bold text-green-600">
                      {tasks?.filter(t => t.status === 'completed').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <span className="text-sm font-medium">Pending Tasks</span>
                    <span className="font-bold text-amber-600">
                      {tasks?.filter(t => t.status === 'pending').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium">Overdue Tasks</span>
                    <span className="font-bold text-red-600">
                      {tasks?.filter(t => t.status === 'pending' && new Date(t.dueDate) < new Date()).length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Summary */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">Most Recent Convert</span>
                  <span className="font-medium">
                    {members?.sort((a, b) => new Date(b.convertedDate).getTime() - new Date(a.convertedDate).getTime())[0]?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">Avg. Days to Baptism</span>
                  <span className="font-medium">21 days</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">Follow-up Completion Rate</span>
                  <span className="font-medium">
                    {tasks?.length ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Most Active Staff Member</span>
                  <span className="font-medium">Pastor John Smith</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <MobileNavigation activeTab="reports" />
    </div>
  );
}
