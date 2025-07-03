import React, { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./contexts/AuthContext";
import Login from "@/pages/Login";

// Lazy load protected components to prevent them from being loaded when not authenticated
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Members = lazy(() => import("@/pages/members"));
const Tasks = lazy(() => import("@/pages/tasks"));
const Progress = lazy(() => import("@/pages/progress"));
const Reports = lazy(() => import("@/pages/reports"));
const NotFound = lazy(() => import("@/pages/not-found"));



function Router() {
  const { currentUser, loading } = useAuth();

  // Don't render any routes until auth state is determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    }>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Dashboard} />
        <Route path="/members" component={Members} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/progress" component={Progress} />
        <Route path="/reports" component={Reports} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
