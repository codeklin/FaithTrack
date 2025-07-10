import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { auth } from "@shared/firebase-config";
import type { User as FirebaseUser } from 'firebase/auth'; // Import User type for clarity

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Helper function to get the current user, waiting if auth state is initializing
function getCurrentUserWhenAvailable(): Promise<FirebaseUser | null> {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      resolve(auth.currentUser);
    } else {
      const unsubscribe = auth.onAuthStateChanged(user => {
        unsubscribe(); // Unsubscribe after first callback
        resolve(user);
      });
    }
  });
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = await getCurrentUserWhenAvailable(); // Wait for user to be available
  if (user) {
    try {
      const token = await user.getIdToken();
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    } catch (error) {
      console.error("Error fetching ID token in getAuthHeaders:", error);
      // Fall through to return headers without Authorization if token fetch fails
    }
  }
  // If no user, or token fetch failed, only Content-Type is returned.
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
