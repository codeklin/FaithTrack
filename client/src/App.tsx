import React, { lazy, Suspense, useState } from "react"; // Added useState
import { Switch, Route } from "wouter";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"; // Added QueryClient class for type, if needed locally
import { Toaster } from "@/components/ui/toaster";
import { queryClient as sharedQueryClient } from "@/lib/queryClient"; // Import the shared instance, aliased
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import { Logo } from "@/components/ui/logo";
import Login from "@/pages/Login";
import PWAInstallPrompt from "@/components/pwa-install-prompt";

// Lazy load protected components to prevent them from being loaded when not authenticated
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Members = lazy(() => import("@/pages/members"));
const Tasks = lazy(() => import("@/pages/tasks"));
const Analytics = lazy(() => import("@/pages/analytics"));
const Progress = lazy(() => import("@/pages/progress"));
const Reports = lazy(() => import("@/pages/reports"));
const NotFound = lazy(() => import("@/pages/not-found"));



function Router() {
  const { currentUser, loading } = useAuth();

  // Don't render any routes until auth state is determined
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Logo size="xl" />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="text-gray-600">Loading FaithTraka...</p>
      </div>
    );
  }

  // If not authenticated, only show login
  if (!currentUser) {
    return <Login />;
  }

  // If authenticated, show protected routes
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Logo size="xl" />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Dashboard} />
        <Route path="/members" component={Members} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/progress" component={Progress} />
        <Route path="/analytics" component={Analytics} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  // Removed local queryClient state: const [localQueryClient] = useState(() => new QueryClient());
  // We will use the sharedQueryClient imported from "@/lib/queryClient"

  return (
    <QueryClientProvider client={sharedQueryClient}> {/* Use the imported shared instance */}
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
          <PWAInstallPrompt />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
