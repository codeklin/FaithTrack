import { useQuery } from "@tanstack/react-query";
import { Loader2, UserPlus, Search } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import DesktopSidebar from "@/components/layout/desktop-sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import MobileNavigation from "@/components/layout/mobile-navigation";
import MemberCard from "@/components/member-card";
import AddMemberDialog from "@/components/dialogs/add-member-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
// import type { Member } from "@shared/firestore-schema"; // Removed Firebase schema
import { z } from "zod"; // Import Zod

// Define placeholder schema and type for Member
// This should be replaced with a proper schema based on your Supabase tables
const memberSchema = z.object({
  id: z.string().uuid(), // Assuming member ID is a UUID
  name: z.string(),
  email: z.string().email().optional().nullable(),
  // Add any other fields that are used by this page or MemberCard
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


export default function Members() {
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useAuth();


  console.log("currentUser", currentUser);


  const { data: members, isLoading, error } = useQuery<Member[]>({
    queryKey: ["/api/members"],
    queryFn: () => apiRequest("GET", "/api/members"),
    enabled: !!currentUser,
  });

  // If currentUser is null, show a loading spinner or a message
  if (!currentUser) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If there's an error and user is logged in, display an error message
  // This handles cases where the API might return an error even if the user is authenticated
  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Error fetching members. Please try again later.</p>
        {/* Optionally, provide a way to retry or log out */}
      </div>
    );
  }

  // If still loading and user is logged in (and no error yet), show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const filteredMembers = members?.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

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
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Members</h2>
                <p className="text-gray-600 mt-1">Manage your congregation members and their spiritual journey.</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button onClick={() => setShowAddMember(true)} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add New Member
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Members List */}
          <Card>
            <CardHeader>
              <CardTitle>All Members ({filteredMembers.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {filteredMembers.length > 0 ? (
                <div className="space-y-4">
                  {filteredMembers.map((member) => (
                    <MemberCard key={member.id} member={member} showDetails />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchTerm ? "No members match your search criteria." : "No members found. Add your first member to get started."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <MobileNavigation activeTab="members" />
      
      <AddMemberDialog open={showAddMember} onOpenChange={setShowAddMember} />
    </div>
  );
}
