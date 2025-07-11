import { useAuth } from '../contexts/AuthContext';
import { useCallback } from 'react';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const useAuthenticatedFetch = () => {
  const { session, loading } = useAuth(); // Get session and loading state

  const authenticatedFetch = useCallback(async (url: string, options: FetchOptions = {}) => {
    // It's possible this function is called when the session is still loading.
    // Or, the session might be null if the user is not authenticated.
    // The original logic already handles the case where token is null.
    const token = session?.access_token;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired or invalid, redirect to login
        // Consider if redirecting here is always the best approach,
        // sometimes you might want to handle 401s differently (e.g. silent refresh)
        // For now, keeping existing redirect behavior.
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
      // Attempt to get more error details from the response body
      let errorBody = 'Unknown error';
      try {
        errorBody = await response.text();
      } catch (e) {
        // ignore if can't read body
      }
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    return response;
  }, [session]); // Dependency array updated to session

  return authenticatedFetch;
};
