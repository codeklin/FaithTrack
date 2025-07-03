import { useQuery } from "@tanstack/react-query";
import { Loader2, TrendingUp, Users, UserCheck, BookOpen, Heart } from "lucide-react";
import DesktopSidebar from "@/components/layout/desktop-sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import MobileNavigation from "@/components/layout/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/api";
import type { Member, Stats } from "@shared/firestore-schema";

export default function ProgressPage() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    queryFn: () => apiRequest('GET', '/api/stats'),
  });

  const { data: members, isLoading: membersLoading } = useQuery<Member[]>({
    queryKey: ["/api/members"],
    queryFn: () => apiRequest('GET', '/api/members'),
  });

  if (isLoading || membersLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalMembers = stats?.newConverts || 0;
  const baptismRate = totalMembers > 0 ? ((stats?.baptized || 0) / totalMembers) * 100 : 0;
  const bibleStudyRate = totalMembers > 0 ? ((stats?.inBibleStudy || 0) / totalMembers) * 100 : 0;
  const smallGroupRate = totalMembers > 0 ? ((stats?.inSmallGroup || 0) / totalMembers) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopSidebar />
      <MobileHeader />
      
      <main className="md:ml-64 pb-20 md:pb-0">
        <div className="p-4 md:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Spiritual Progress</h2>
              <p className="text-gray-600 mt-1">Track member growth and spiritual development milestones.</p>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Overall Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Baptism Rate</span>
                    <span className="text-sm text-gray-500">{stats?.baptized || 0}/{totalMembers}</span>
                  </div>
                  <Progress value={baptismRate} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{baptismRate.toFixed(1)}% of converts baptized</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Bible Study Enrollment</span>
                    <span className="text-sm text-gray-500">{stats?.inBibleStudy || 0}/{totalMembers}</span>
                  </div>
                  <Progress value={bibleStudyRate} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{bibleStudyRate.toFixed(1)}% enrolled in Bible study</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Small Group Participation</span>
                    <span className="text-sm text-gray-500">{stats?.inSmallGroup || 0}/{totalMembers}</span>
                  </div>
                  <Progress value={smallGroupRate} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{smallGroupRate.toFixed(1)}% active in small groups</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Spiritual Journey Milestones</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">New Converts</p>
                        <p className="text-sm text-gray-600">Accepted Christ</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{stats?.newConverts || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Baptized</p>
                        <p className="text-sm text-gray-600">Public declaration</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{stats?.baptized || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Bible Study</p>
                        <p className="text-sm text-gray-600">Growing in knowledge</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-600">{stats?.inBibleStudy || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Small Groups</p>
                        <p className="text-sm text-gray-600">Fellowship & community</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">{stats?.inSmallGroup || 0}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Progress Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Member Progress Timeline</CardTitle>
              <p className="text-sm text-gray-600">Track individual spiritual growth milestones</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members?.map((member: any) => (
                  <div key={member.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">
                            Converted {new Date(member.convertedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{member.status}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                          member.baptized ? 'bg-green-600' : 'bg-gray-300'
                        }`}>
                          <UserCheck className={`w-4 h-4 ${member.baptized ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Baptized</p>
                      </div>
                      
                      <div className="text-center">
                        <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                          member.inBibleStudy ? 'bg-amber-600' : 'bg-gray-300'
                        }`}>
                          <BookOpen className={`w-4 h-4 ${member.inBibleStudy ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Bible Study</p>
                      </div>
                      
                      <div className="text-center">
                        <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                          member.inSmallGroup ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}>
                          <Users className={`w-4 h-4 ${member.inSmallGroup ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Small Group</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {!members?.length && (
                  <p className="text-gray-500 text-center py-8">No members found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <MobileNavigation activeTab="progress" />
    </div>
  );
}
