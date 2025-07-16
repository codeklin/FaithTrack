import express from 'express';
import { supabase } from './supabase.js';

const app = express();
app.use(express.json());

// Example API route to fetch data from a 'users' table in Supabase
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      throw error;
    }
    res.status(200).json(data);
  } catch (error: unknown) { // Use unknown for better type safety
    res.status(500).json({
      error: error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
});

// --- EXISTING PLACEHOLDER ROUTE (adjusted for consistency) ---
app.get('/api/stats', async (req, res) => {
  try {
    // TODO: Replace with actual logic to fetch stats
    console.log(`GET /api/stats called`);
    res.status(200).json({ message: "Endpoint /api/stats reached successfully", data: { totalMembers: 0, activeTasks: 0, completedTasks: 0 } });
  } catch (error: any) {
    console.error('Error in /api/stats:', error);
    res.status(500).json({ error: 'Failed to process /api/stats' });
  }
});


// --- ADD THIS NEW ENDPOINT ---
app.get('/api/pastors', async (req, res) => {
  try {
    // Fetch all records from the 'pastors' table
    const { data, error } = await supabase.from('pastors').select('id, name');

    if (error) {
      // If Supabase returns an error, send it back
      throw error;
    }
    // Send the list of pastors back to the client
    res.status(200).json(data);
  } catch (error: unknown) { // Use unknown for better type safety
    res.status(500).json({
      error: error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
});

function createPlaceholderRoute(path: string, data: any = []) {
  app.get(path, async (req, res) => {
    try {
      console.log(`GET ${path} called`);
      res.status(200).json({ message: `Endpoint ${path} reached successfully`, data });
    } catch (error: unknown) { // Use unknown for better type safety
      console.error(`Error in ${path}:`, error);
      res.status(500).json({
        error: error instanceof Error ? `Failed to process ${path}: ${error.message}` : `Failed to process ${path}`,
      });
    }
  });
}

createPlaceholderRoute('/api/tasks/urgent', []);
createPlaceholderRoute('/api/members', []);
createPlaceholderRoute('/api/members/recent', []);


// Vercel will use this exported app
export default app;