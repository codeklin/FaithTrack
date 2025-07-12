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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- ADDED PLACEHOLDER ROUTE ---
app.get('/api/stats', async (req, res) => {
  try {
    // TODO: Replace with actual logic to fetch stats
    const placeholderStats = {
      totalMembers: 0,
      activeTasks: 0,
      completedTasks: 0,
    };
    res.status(200).json(placeholderStats);
  } catch (error: any) {
    console.error('Error fetching /api/stats:', error); // Log the error server-side
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// TODO: Add other missing routes here, for example:
// app.get('/api/tasks/urgent', async (req, res) => { /* ... your logic ... */ });
// app.get('/api/members', async (req, res) => { /* ... your logic ... */ });
// app.get('/api/members/recent', async (req, res) => { /* ... your logic ... */ });
// etc.

// Vercel will use this exported app
export default app;