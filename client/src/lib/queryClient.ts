import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { auth } from "@shared/firebase-config"; // This will now be Supabase auth
// import type { User as FirebaseUser } from 'firebase/auth'; // Import User type for clarity

// TODO: Define a Supabase User type or import from @supabase/supabase-js if available and suitable
type SupabaseUser = any; // Placeholder

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Helper function to get the current user, waiting if auth state is initializing
// TODO: Re-implement with Supabase auth (e.g., supabase.auth.getUser() or getSession())
function getCurrentUserWhenAvailable(): Promise<SupabaseUser | null> {
  // return new Promise((resolve) => {
  //   if (auth.currentUser) { // auth.currentUser is Firebase specific
  //     resolve(auth.currentUser);
  //   } else {
  //     const unsubscribe = auth.onAuthStateChanged(user => { // auth.onAuthStateChanged is Firebase specific
  //       unsubscribe(); // Unsubscribe after first callback
  //       resolve(user);
  //     });
  //   }
  // });
  console.warn("getCurrentUserWhenAvailable needs to be implemented for Supabase");
  return Promise.resolve(null); // Placeholder
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  // const user = await getCurrentUserWhenAvailable(); // Wait for user to be available
  // if (user) {
  //   try {
  //     const token = await user.getIdToken(); // user.getIdToken() is Firebase specific
  //     return {
  //       'Authorization': `Bearer ${token}`,
  //       'Content-Type': 'application/json'
  //     };
  //   } catch (error) {
  //     console.error("Error fetching ID token in getAuthHeaders:", error);
  //     // Fall through to return headers without Authorization if token fetch fails
  //   }
  // }

  // TODO: Re-implement with Supabase to get session/token
  // For now, returning default headers to allow compilation.
  // This will likely break actual API calls until Supabase auth is fully integrated.
  console.warn("getAuthHeaders needs to be implemented for Supabase to include Authorization token");
  const session = await auth.getSession(); // Supabase getSession
  if (session.data.session?.access_token) {
    return {
      'Authorization': `Bearer ${session.data.session.access_token}`,
      'Content-Type': 'application/json'
    };
  }
  return {
    'Content-Type': 'application/json'
  };
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  const headers = await getAuthHeaders();

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const headers = await getAuthHeaders();

    const res = await fetch(queryKey[0] as string, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient();
