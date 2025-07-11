import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import DesktopSidebar from "@/components/layout/desktop-sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import MobileNavigation from "@/components/layout/mobile-navigation";
import TaskCard from "@/components/task-card";
import AddTaskDialog from "@/components/dialogs/add-task-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import type { Task } from "@shared/firestore-schema";

export default function Tasks() {
  const [showAddTask, setShowAddTask] = useState(false);
  const { currentUser } = useAuth();

  const { data: allTasks, isLoading: allTasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    enabled: !!currentUser,
  });

  const { data: urgentTasks, isLoading: urgentTasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks/urgent"],
    enabled: !!currentUser,
  });

  const { data: pendingTasks, isLoading: pendingTasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks/pending"],
    enabled: !!currentUser,
  });

  const completedTasks = allTasks?.filter(task => task.status === 'completed') || [];

  if (allTasksLoading || urgentTasksLoading || pendingTasksLoading) {
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
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Follow-ups & Tasks</h2>
                <p className="text-gray-600 mt-1">Manage follow-up tasks and member care activities.</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button onClick={() => setShowAddTask(true)} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Task
                </Button>
              </div>
            </div>
          </div>

          {/* Tasks Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Task Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="urgent" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="urgent">
                    Urgent ({urgentTasks?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({pendingTasks?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed ({completedTasks.length})
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    All ({allTasks?.length || 0})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="urgent" className="mt-6">
                  <div className="space-y-4">
                    {urgentTasks?.length ? (
                      urgentTasks.map((task: Task) => (
                        <TaskCard key={task.id} task={task} showMember />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No urgent tasks found.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="pending" className="mt-6">
                  <div className="space-y-4">
                    {pendingTasks?.length ? (
                      pendingTasks.map((task: Task) => (
                        <TaskCard key={task.id} task={task} showMember />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No pending tasks found.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                  <div className="space-y-4">
                    {completedTasks.length ? (
                      completedTasks.map((task: Task) => (
                        <TaskCard key={task.id} task={task} showMember />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No completed tasks found.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="all" className="mt-6">
                  <div className="space-y-4">
                    {allTasks?.length ? (
                      allTasks.map((task: Task) => (
                        <TaskCard key={task.id} task={task} showMember />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No tasks found. Create your first task to get started.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <MobileNavigation activeTab="tasks" />
      
      <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} />
    </div>
  );
}
